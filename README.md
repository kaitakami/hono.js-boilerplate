# Hono.js API boilerplate

This boilerplate is a Node.js API built with Hono.js and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- pnpm (feel free to use any other package manager)

### Tech Stack

- Node.js (feel free to change to any other runtime)
- Hono.js
- TypeScript
- Biome
- Pino logger
- Zod
- Docker

### Features

1. Simple api versioning
2. Dockerized (feel free to remove this)
3. Autoroutes (routes are loaded by adding them to ./src/routes)
4. Fully-typed
5. Health endpoint
6. As unopinionated as possible but with some features

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Development

To start the development server:

```
pnpm run dev
```

### Production

To build the project:

```
pnpm run build
```

To start the production server:

```
pnpm run start
```

## Docker Compose

To build:

```
docker compose build
```

To start the server with Docker Compose:

```
docker compose up
```



