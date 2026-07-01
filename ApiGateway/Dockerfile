# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /usr/src/myapp
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17
WORKDIR /usr/src/myapp

COPY --from=builder /usr/src/myapp/target/*.jar apigateway.jar
EXPOSE 8082
CMD ["java","-jar","apigateway.jar"]