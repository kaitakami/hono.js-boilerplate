import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { OpenAPIHono } from "@hono/zod-openapi";

export async function loadRoutes(
	app: OpenAPIHono,
	routesDir: string,
	prefix = "/api",
) {
	try {
		const routeFiles = await readdir(routesDir);
		const routeModules = routeFiles.filter((file) =>
			file.endsWith(".routes.ts"),
		);

		for (const file of routeModules) {
			const routeName = file.replace(".routes.ts", "");
			const routePath = join(routesDir, file);
			const route = await import(routePath);

			if (route.default && route.default instanceof OpenAPIHono) {
				app.route(`${prefix}/${routeName}`, route.default);
			} else {
				console.warn(
					`Warning: ${file} does not export a default OpenAPIHono instance.`,
				);
			}
		}
	} catch (error) {
		console.error(
			`Error loading routes: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
