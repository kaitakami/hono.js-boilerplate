import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import type { ZodType } from "zod";

type Methods = "get" | "post" | "put" | "delete" | "options" | "patch";

interface Route {
	path: string;
	method: Methods;
	schema?: ZodType;
	handler: (c: Context) => Promise<Response> | Response;
}

export function createFactory() {
	const routes: Route[] = [];

	return {
		addRoute: (route: Route) => {
			routes.push(route);
		},
		createHono: () => {
			const app = new OpenAPIHono();
			for (const route of routes) {
				const openApiRoute = createRoute({
					method: route.method,
					path: route.path,
					request: route.schema
						? {
								body: {
									content: { "application/json": { schema: route.schema } },
								},
							}
						: undefined,
					responses: {
						200: { description: "Successful response" },
					},
				});
				app.openapi(openApiRoute, route.handler);
			}
			return app;
		},
	};
}
