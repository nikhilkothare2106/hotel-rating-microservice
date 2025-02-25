# Hotel Rating Microservice

## Overview
The **Hotel Rating Microservice** is a part of a microservices-based architecture that enables users to rate and review hotels. This service stores user ratings, retrieves hotel reviews, and integrates with other microservices like User Service and Hotel Service. It uses **Spring Cloud Eureka** for service discovery and **Feign Client** for inter-service communication.

### Key Features
- **User-based Ratings** - Fetch all ratings submitted by a specific user.
- **Hotel-based Reviews** - Retrieve all reviews for a specific hotel.
- **Service-to-Service Communication** - Uses Feign Clients to interact with Hotel Service.
- **API Gateway Integration** - Routes requests via Spring Cloud Gateway.
- **MongoDB for Persistence** - Stores ratings and reviews efficiently.

