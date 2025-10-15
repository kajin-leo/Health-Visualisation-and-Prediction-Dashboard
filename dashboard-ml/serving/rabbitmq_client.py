import pika
import json
import os
import logging
from threading import Lock

logger = logging.getLogger(__name__)

class RabbitMQClient:
    def __init__(self, host=None, port=None, username=None, password=None, virtual_host=None):
        self.host = host or os.getenv('ML_RABBITMQ_HOST', 'localhost')
        self.port = int(port or os.getenv('ML_RABBITMQ_PORT', 5672))
        self.username = username or os.getenv('ML_RABBITMQ_USERNAME', 'guest')
        self.password = password or os.getenv('ML_RABBITMQ_PASSWORD', 'guest')
        self.virtual_host = virtual_host or os.getenv('ML_RABBITMQ_DEFAULT_VHOST', '/')

        self.credentials = pika.PlainCredentials(self.username, self.password)
        self.parameters = pika.ConnectionParameters(
            host=self.host,
            port=self.port,
            credentials=self.credentials,
            virtual_host=self.virtual_host,
            heartbeat=600,
            blocked_connection_timeout=300,
            connection_attempts=3,
            retry_delay=2,
            socket_timeout=5
        )

        self.connection = None
        self.channel = None
        self.lock = Lock()
        self._connect()

    def _connect(self):
        max_retries = 5
        for attempt in range(max_retries):
            try:
                self.connection = pika.BlockingConnection(self.parameters)
                self.channel = self.connection.channel()
                logger.info(f"Successfully connected to RabbitMQ at {self.host}:{self.port}")
                return
            except Exception as e:
                logger.warning(f"Connection attempt {attempt + 1}/{max_retries} failed: {e}")
                if attempt < max_retries - 1:
                    import time
                    time.sleep(2 ** attempt)
                else:
                    logger.error("Failed to connect to RabbitMQ after all retries")
                    raise

    def _ensure_connection(self):
        try:
            if self.connection is None or self.connection.is_closed:
                logger.info("Connection closed, reconnecting...")
                self._connect()
            if self.channel is None or self.channel.is_closed:
                logger.info("Channel closed, recreating...")
                self.channel = self.connection.channel()
        except Exception as e:
            logger.error(f"Error ensuring connection: {e}")
            raise

    def declare_queue(self, queue_name, durable=True):
        with self.lock:
            self._ensure_connection()
            self.channel.queue_declare(queue=queue_name, durable=durable)

    def consume(self, queue_name, callback, prefetch_count=1):
        consumer_connection = None
        consumer_channel = None

        try:
            logger.info(f"Starting consumer for queue: {queue_name}")
            consumer_connection = pika.BlockingConnection(self.parameters)
            consumer_channel = consumer_connection.channel()
            consumer_channel.basic_qos(prefetch_count=prefetch_count)
            consumer_channel.basic_consume(
                queue=queue_name,
                on_message_callback=callback,
                auto_ack=False
            )
            logger.info(f"Consumer started for queue: {queue_name}")
            consumer_channel.start_consuming()
            
        except KeyboardInterrupt:
            logger.info(f"Stopping consumer for queue: {queue_name}")
            if consumer_channel:
                consumer_channel.stop_consuming()
        except Exception as e:
            logger.error(f"Error in consumer for queue {queue_name}: {e}")
            if consumer_channel:
                try:
                    consumer_channel.stop_consuming()
                except:
                    pass
        finally:
            if consumer_connection and not consumer_connection.is_closed:
                try:
                    consumer_connection.close()
                    logger.info(f"Closed consumer connection for queue: {queue_name}")
                except:
                    pass
        
    def publish(self, queue_name, message, persistent=True):
        with self.lock:
            try:
                self._ensure_connection()
                
                message_body = json.dumps(message)
                properties = pika.BasicProperties(
                    delivery_mode=2 if persistent else 1,
                    content_type='application/json'
                )

                self.channel.basic_publish(
                    exchange='',
                    routing_key=queue_name,
                    body=message_body,
                    properties=properties
                )
                logger.debug(f"Published message to queue: {queue_name}")
                
            except Exception as e:
                logger.error(f"Error publishing message to {queue_name}: {e}")
                try:
                    self._connect()
                    self.channel.basic_publish(
                        exchange='',
                        routing_key=queue_name,
                        body=json.dumps(message),
                        properties=pika.BasicProperties(
                            delivery_mode=2 if persistent else 1,
                            content_type='application/json'
                        )
                    )
                    logger.info(f"Successfully published after reconnection")
                except Exception as retry_error:
                    logger.error(f"Failed to publish even after reconnection: {retry_error}")
                    raise
    
    def close(self):
        with self.lock:
            if self.connection and not self.connection.is_closed:
                try:
                    self.connection.close()
                    logger.info("RabbitMQ connection closed")
                except Exception as e:
                    logger.error(f"Error closing connection: {e}")