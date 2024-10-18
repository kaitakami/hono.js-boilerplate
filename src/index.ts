import crypto from "node:crypto";
import { join } from "node:path";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import dotenv from "dotenv";
import type { Context } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { logger } from "./logger";
import { loadRoutes } from "./utils/routeLoader";

dotenv.config();

const customLogger = async (c: Context, next: () => Promise<void>) => {
	const requestId = crypto.randomUUID();
	c.set("requestId", requestId);

	const start = Date.now();

	await next();

	const end = Date.now();
	const responseTime = end - start;

	logger.request({
		requestId,
		method: c.req.method,
		url: c.req.url,
		status: c.res.status,
		responseTime: `${responseTime}ms`,
	});
};

async function bootstrap() {
	const app = new OpenAPIHono();

	// Middleware
	app.use("*", customLogger);
	app.use("*", cors());
	app.use("*", compress());
	app.use("*", secureHeaders());
	app.use("*", prettyJSON());

	// Automatically load and mount routes
	const routesDir = join(__dirname, "v0", "routes");
	const loadedRoutes = await loadRoutes(app, routesDir, "/api/v0");

	// Log all loaded routes
	logger.info("Loaded routes:");
	for (const route of loadedRoutes) {
		logger.info(`- ${route}`);
	}

	// Swagger UI
	app.get("/api/docs", swaggerUI({ url: "/api/docs/openapi.json" }));
	app.doc31("/api/docs/openapi.json", {
		openapi: "3.1.0",
		info: {
			title: "My API",
			version: "v0",
		},
	});

	// Error handling middleware
	app.onError((err, c) => {
		logger.error(`Unhandled error: ${err}`);
		return c.json(
			{ error: "Internal Server Error", message: err.message },
			500,
		);
	});

	const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
	logger.info(`Server is starting on port ${port}`);

	serve({
		fetch: app.fetch,
		port,
	});
}

bootstrap().catch((error) => {
	logger.error(
		`Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
	);
	process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
	logger.info("SIGTERM signal received: closing HTTP server");
	// Implement proper server shutdown logic here
});
