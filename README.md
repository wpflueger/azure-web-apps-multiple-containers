# React + FastAPI Multi-Container Application on Azure Web App

This project demonstrates how to run a full-stack application using a React front end (with TypeScript and Tailwind CSS) and a Python (FastAPI) back end in separate containers within a single Azure Web App. A custom Nginx reverse proxy is used to route traffic—serving the front end on port 80 and forwarding API requests (under `/api`) to the back end.

> **Note:** Azure App Service for Containers exposes only port 80 externally. This setup uses a reverse proxy to route requests appropriately between containers.

---

## Project Structure

```
project-root/
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   ├── index.html
│   │   └── env-config.js.template
│   ├── src/
│   │   ├── index.tsx
│   │   ├── index.css
│   │   └── App.tsx
│   └── nginx-entrypoint.sh
├── nginx-proxy/
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.azure.yml
```

---

## Components Overview

- **Backend (FastAPI):**
  - A simple Python application with an endpoint (e.g., `/api/click`) that performs a basic action (such as incrementing a counter).
  - Configured to listen on port **80** internally.
  
- **Frontend (React):**
  - Built with TypeScript and styled with Tailwind CSS.
  - Uses a runtime injection mechanism to set the API endpoint dynamically.
  - Contains an `env-config.js.template` file in the `public/` folder with a placeholder for `REACT_APP_API_ROOT`.
  - An entrypoint script (`nginx-entrypoint.sh`) uses `envsubst` at container startup to generate an `env-config.js` file with the actual environment variable value.
  - The `public/index.html` file includes:
    ```html
    <script src="/env-config.js"></script>
    ```
    so that the runtime-injected values are loaded before the React bundle.
  
- **Reverse Proxy (Nginx):**
  - A custom Nginx container that listens on port **80** externally.
  - Routes requests starting with `/api` to the back end service.
  - Serves all other requests using the front end container.

- **Multi-Container Networking:**
  - All services are connected via an internal Docker network, allowing seamless communication between containers.

---

## Local Development

### Prerequisites

- Docker and Docker Compose installed.
### Building and Pushing Images

1. **Build images locally:**

    ```bash
    # Build backend image
    docker build -t yourregistry.azurecr.io/backend:latest ./backend

    # Build frontend image
    docker build -t yourregistry.azurecr.io/frontend:latest ./frontend
    
    # Build nginx proxy image
    docker build -t yourregistry.azurecr.io/nginx-proxy:latest ./nginx-proxy
    ```

2. **Log in to your container registry:**

    ```bash
    # Log in to Azure Container Registry
    az acr login --name yourregistry
    
    # Or for Docker Hub
    docker login --username yourusername --password yourpassword
    ```

3. **Push images to the registry:**

    ```bash
    # Push all images
    docker push yourregistry.azurecr.io/backend:latest
    docker push yourregistry.azurecr.io/frontend:latest
    docker push yourregistry.azurecr.io/nginx-proxy:latest
    ```

4. **Update your docker-compose.azure.yml file:**

     ```yaml
     version: '3.8'

     services:
       backend:
         image: <your-backend-image>:latest
         expose:
           - "80"
         networks:
           - app-network

       frontend:
         image: <your-frontend-image>:latest
         environment:
           - REACT_APP_API_ROOT=${REACT_APP_API_ROOT}
         ports:
           - "80:80"
         networks:
           - app-network

       reverse-proxy:
         image: <your-nginx-image>:latest
         build:
           context: ./nginx-proxy
         ports:
           - "80:80"
         depends_on:
           - backend
           - frontend
         networks:
           - app-network

     networks:
       app-network:
         driver: bridge
     ```

4. **Deploy the App:**
   - Use the Azure CLI to deploy your multi-container app:

     ```bash
     az webapp create \
       --resource-group <resource-group-name> \
       --plan <app-service-plan> \
       --multicontainer-config-type compose \
       --multicontainer-config-file docker-compose.azure.yml \
       --name <your-app-name>
     ```

---

## How It Works

- **Runtime Injection:**
  - The front end uses a runtime injection mechanism to configure the API endpoint. At container startup, the `nginx-entrypoint.sh` script replaces the placeholder in `env-config.js.template` with the value of `REACT_APP_API_ROOT` from the environment. This generated file (`env-config.js`) is loaded by the browser to configure the app dynamically.
  
- **Reverse Proxy Routing:**
  - The Nginx reverse proxy listens on port 80. It forwards requests with the `/api` prefix to the back end service and serves all other requests from the front end service.

- **Container Networking:**
  - All containers communicate over an internal Docker network, ensuring that services can resolve each other by name.

---

## Summary

This project illustrates how to deploy a full-stack application with a React front end and a FastAPI back end across multiple containers in a single Azure Web App. By using a reverse proxy and a runtime configuration injection mechanism, you can manage your environment-specific settings without rebuilding the front end image.

Feel free to extend and modify this project to suit your deployment and development needs!
