# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Gateway URL baked into the static build. Override at build time, e.g.:
#   docker build --build-arg VITE_API_BASE_URL=http://your-host:8084 -t hotel-rating-frontend .
ARG VITE_API_BASE_URL=http://localhost:8084
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
