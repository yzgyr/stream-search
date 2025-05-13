# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production (only if in production mode)
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then pnpm run build; fi

# Use a lightweight web server for serving the built app
FROM node:18-alpine AS runner

# Install pnpm globally in the runner stage
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy the built app and other necessary files from the builder stage
COPY --from=builder /src/app/.next ./.next
COPY --from=builder /src/app/package.json ./
COPY --from=builder /src/app/public ./public
COPY --from=builder /src/app/pnpm-lock.yaml ./

# Install only production dependencies using pnpm
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then pnpm install --prod; else pnpm install; fi

# Expose the port the app runs on
EXPOSE 3000

# Set the default command based on the environment
ENV NODE_ENV=$NODE_ENV
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\"; then pnpm start; else pnpm run dev; fi"]