import { join } from "node:path";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { loadRoutes } from "./utils/routeLoader";

async function bootstrap() {
	const app = new OpenAPIHono();

	// Middleware
	app.use("*", logger());
	app.use("*", cors());
	app.use("*", compress());
	app.use("*", secureHeaders());
	app.use("*", prettyJSON());

	// Automatically load and mount routes
	const routesDir = join(__dirname, "v0", "routes");
	await loadRoutes(app, routesDir, "/api/v0");

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
		console.error(`Unhandled error: ${err}`);
		return c.json(
			{ error: "Internal Server Error", message: err.message },
			500,
		);
	});

	const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
	console.log(`Server is starting on port ${port}`);

	serve({
		fetch: app.fetch,
		port,
	});
}

bootstrap().catch((error) => {
	console.error(
		`Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
	);
	process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
	console.log("SIGTERM signal received: closing HTTP server");
	// Implement proper server shutdown logic here
});
