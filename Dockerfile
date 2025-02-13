# Frontend Dockerfile
FROM node:18
WORKDIR /app

# Copy the source code into the container
COPY . .

# Install dependencies
RUN npm i --legacy-peer-deps

# Build the Next.js app
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]