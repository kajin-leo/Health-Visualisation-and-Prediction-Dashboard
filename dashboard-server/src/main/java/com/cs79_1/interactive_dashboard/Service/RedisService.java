package com.cs79_1.interactive_dashboard.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void saveObject(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public Object getObject(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void saveWithExpire(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    public void saveHash(String key, String hashKey, Object value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }

    public void saveList(String key, Object value) {
        redisTemplate.opsForList().rightPush(key, value);
    }

    public void saveSet(String key, Object... values) {
        redisTemplate.opsForSet().add(key, values);
    }
}
