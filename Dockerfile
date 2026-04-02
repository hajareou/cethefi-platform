# Stage 1: Build the Quasar SPA
FROM node:20-alpine AS builder
WORKDIR /app

# Copy everything first so quasar.config.js is present when postinstall runs `quasar prepare`
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve with nginx
FROM docker.io/nginx:alpine
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# SPA routing: redirect all 404s to index.html
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80