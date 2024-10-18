import { createFactory } from "../../utils/routeFactory";
import { HealthController } from "../controllers/healthController";
import { HealthService } from "../services/health.service";
import { SystemHealthSchema } from "../types/health";

const factory = createFactory();
const healthService = new HealthService();
const healthController = new HealthController(healthService);

factory.addRoute({
	path: "/",
	method: "get",
	schema: SystemHealthSchema,
	handler: async (c) => {
		const health = await healthController.getHealth(c);
		return c.json(health);
	},
});

export default factory.createHono();
