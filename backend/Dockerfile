# backend/Dockerfile
FROM oven/bun:1-alpine AS release

WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
# Assumes your Hono app's entry point and source code are in a 'src' directory
COPY src ./src

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
# This will use the "start" script from your backend/package.json
CMD ["bun", "start"]
