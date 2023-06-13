ARG NGINX_PATH

FROM node:alpine as build

# Working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build and cleanup
RUN yarn build

# NGINX
FROM nginx:stable-alpine
ENV NODE_ENV=production
ARG NGINX_PATH
COPY --from=build /app/build /usr/share/nginx/html 
COPY ${NGINX_PATH} /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
