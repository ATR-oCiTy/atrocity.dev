FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (compiles TS and copies data files)
RUN npm run build

EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]
