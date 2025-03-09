FROM node:14-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY public/env-config.js.template /usr/share/nginx/html/env-config.js.template
COPY nginx-entrypoint.sh /docker-entrypoint.d/
# Make entrypoint executable
RUN chmod +x /docker-entrypoint.d/nginx-entrypoint.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
