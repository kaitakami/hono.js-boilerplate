import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "../logger";

export async function loadRoutes(
	app: OpenAPIHono,
	routesDir: string,
	prefix = "/api",
): Promise<string[]> {
	const loadedRoutes: string[] = [];
	try {
		const routeFiles = await readdir(routesDir);

		for (const file of routeFiles) {
			const routePath = join(routesDir, file);

			const route = await import(routePath);

			if (route.default && route.default instanceof OpenAPIHono) {
				const fullPath = `${prefix}/${file.split(".")[0]}`;
				app.route(fullPath, route.default);
				loadedRoutes.push(fullPath);
			} else {
				logger.warn(
					`Warning: ${file} does not export a default OpenAPIHono instance.`,
				);
			}
		}
	} catch (error) {
		logger.error(
			`Error loading routes: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
	return loadedRoutes;
}
