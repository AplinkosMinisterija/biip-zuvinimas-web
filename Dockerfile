FROM node:20-alpine as build

# Working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build and cleanup
RUN yarn build

# Caddy
FROM caddy:2.6-alpine

COPY ./caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/build /srv