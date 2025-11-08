# About This Project
This is the Capstone Project of CS79-1, COMP5307, 2025S2. The project implements an Activity Intensity Simulate function, where users can drag on a chart to simulate the change of their Activity Intensity, and retrieve a predicted HFZ (Healthy Fitness Zone) classification marking the possible health condition following the activity pattern as daily routine, aiming at helping users develop an appropriate intensity of activities to keep health using intrinsic motivation. The project also visualises multiple types of health data, ranging from anthropometric measurements to bioelectrical impedance. 

# Project Structure
- The frontend SPA is developed using React + TypeScript, located in `/dashboard-frontend`. 
- The backend is a Spring Boot server, located in `/dashboard-server`. 
- The model service is located in `/dashboard-ml`, which applies our trained model on top of the MVTS structure. 
- The iOS Demo App is located in `/dashboard-extract`. This is for extracting Apple HealthKit data from iPhone and export as JSON files so that you can upload your own data while registration. 

# How to build
The project implements Docker Compose. To fully boot up, you can run `docker compose up -d --build` at the root directory of the project. For the subsequent launching, the `--build` parameter is not required. 

## Before you build
The Docker Compose config file, which is `compose.yaml`, reads critical configurations from environment variables, such as Docker Container Publish Ports, OpenAI API Key, and domains for the frontend and the server. You need to make a duplicate of `.env.example`, rename it to `.env` and fill the blanks or alter the values of some fields. 

Please be aware that the domains, which will be `WEB_FRONTEND_BASE` and `SERVER_BASE` in `.env`, should be configured according to your actual deployment environment. `WEB_FRONTEND_BASE` is for CORS Policy. If multiple domains are needed, separate them with commas without space (e.g., `http://domain.com,https://domain.com`). `SERVER_BASE` specifies the API endpoints for the frontend. 

>For localhost deployment, please make sure the ports of `WEB_FRONTEND_BASE` and `SERVER_BASE` are their containers' publish ports. 

# How to import data
Before batch importing the sample data, please make sure your data follow the pattern. 

To import, you can visit your frontend and sign in using Admin Account. You can find your auto-generated Admin Account on the server consoles, and its password will be rotated every 30 minutes. You can also retrieve the account by `GET {YOUR_SERVER}/localbackend/admin`. 

You should import the Participant Attributes table first, which is the `.csv` with all static attributes. Afterwards you can import all the activities data. The file names of activities data should match the `participant_id` in the Participant Attributes table. 

After importing, you can sign in using the imported accounts. The username is the `participant_id` (`SYNTH_xxxxxx`), the password is `pwd@` concatenated with the digits from the id (`pwd@xxxxxx`). 

# Custom Data
You can also extract your data from Apple HealthKit using the iOS demo app in directory `dashboard-extract`. Please be aware that the process of generating JSON file under debug mode may block the UI thread. If it happens, please wait patiently. 

When you get your JSON file, you can upload it during account registration. 