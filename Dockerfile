# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN pnpm run build

# Use a lightweight web server for serving the built app
FROM node:18-alpine AS runner

# Install pnpm globally in the runner stage
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy the built app and other necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/pnpm-lock.yaml ./

# Install only production dependencies using pnpm
RUN pnpm install --prod
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "run", "start"]