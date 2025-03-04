FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY target/polling-app.jar polling-app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "polling-app.jar"]