FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Copy package files and .env
COPY package.json pnpm-lock.yaml .env ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the app
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
