# 1. Build stage
FROM node:18-alpine AS builder
# Set the working directory
WORKDIR /app
# Copy the rest of app's source code from the dir
COPY teambeam/package.json teambeam/yarn.lock ./
# Install depedencies using yarn
RUN yarn install
# Copy the rest of app's source code from the dir
COPY teambeam/ .
# build app
RUN yarn build

# 2. Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["yarn", "start"]
