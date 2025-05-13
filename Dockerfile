# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production (only if in production mode)
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Use a lightweight web server for serving the built app
FROM node:18-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy the built app and other necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Install only production dependencies if in production mode
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then npm install --production; else npm install; fi

# Expose the port the app runs on
EXPOSE 3000

# Set the default command based on the environment
ENV NODE_ENV=$NODE_ENV
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"]