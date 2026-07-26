# Backend Stage
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app/backend
COPY backend/linkhub-backend/pom.xml .
COPY backend/linkhub-backend/mvnw .
COPY backend/linkhub-backend/.mvn .mvn
RUN ./mvnw dependency:go-offline -B
COPY backend/linkhub-backend/src src
RUN ./mvnw package -DskipTests -B

# Frontend Stage
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Production Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache nginx

# Copy backend JAR
COPY --from=backend-build /app/backend/target/linkhub-backend-0.0.1-SNAPSHOT.jar app.jar

# Copy frontend build to nginx
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 8080

# Start Nginx and Spring Boot
CMD sh -c "nginx && java -jar app.jar --server.port=8080"

