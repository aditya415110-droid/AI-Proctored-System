FROM node:18-slim

# Install Python 3 and Java
RUN apt-get update && apt-get install -y \
    python3 \
    default-jdk \
    && ln -s /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install root (backend) dependencies first for layer caching
COPY package.json ./
RUN npm install

# Copy and install frontend dependencies
COPY frontend/package.json ./frontend/
RUN npm install --prefix frontend

# Copy all remaining source files
COPY . .

# Build-time arg for React env vars (baked into the frontend bundle)
ARG REACT_APP_UPLOADCARE_PUBLIC_KEY
ENV REACT_APP_UPLOADCARE_PUBLIC_KEY=$REACT_APP_UPLOADCARE_PUBLIC_KEY

# Build the React frontend
RUN npm run build --prefix frontend

ENV NODE_ENV=production

EXPOSE 10000

CMD ["node", "backend/server.js"]