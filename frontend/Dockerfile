# Stage 1: Build
FROM node:14-alpine as build
WORKDIR /app
ARG REACT_APP_API_ROOT
ENV REACT_APP_API_ROOT=${REACT_APP_API_ROOT}
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:14-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]
