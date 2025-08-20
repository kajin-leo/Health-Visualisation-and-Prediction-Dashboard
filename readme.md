# Frontend Dev
`cd dashboard-frontend` then `npm install` to get ready for developing. `npm run dev` to run the project. 

[Lucide Icons](https://lucide.dev/icons/) is used for icon assets. 
[Windtail CSS](https://tailwindcss.com/docs/) is used for styling. 
[Hero UI](https://www.heroui.com/docs/) is used for general ui components. (It is installed globally so for component importing please follow the instruction with `Global`)
[Chart.js](https://www.chartjs.org/docs) is used for charts. With [chartjs-plugin-dragdata](https://github.com/artus9033/chartjs-plugin-dragdata), interactive data visualisation is implemented. 
[axios](https://axios-http.com/docs/intro) will be used for HTTP Request/Response handling. 

# Spring Boot Server Dev
`cd dashboard-server` first. 

For developing the Spring Boot program only, use `docker compose -f compose.data-only.yaml up -d` to launch PostgresSQL, Redis and RabbitMQ. 

For testing the connectivity between the frontend and the server, you can call `docker compose up -d`. 

PostgresSQL runs on port `5432` in the container and is forwarded to port `5480` for out-of-container connection. 
Redis runs on `6379` and is forwarded to `5481`. 
RabbitMQ runs on `5672` with portal on `15672` and is forwarded to `5482` and `5483` respectively. 
Spring Boot server runs on `8080` and is forwarded to `5484`. Frontend axios config is already set its baseURL to `localhost:5484` for dev.

# Machine Learning Dev
The ML model should be wrapped with [Flask](https://flask.palletsprojects.com/en/stable/) for communication from Spring Boot server. 

Docker Compose configuration now defines Flask service to be run on port `5000` in the container and forwarded to `5486`. When the development comes to this stage, please be awared. 