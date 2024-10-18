import type { Context } from "hono";
import type { HealthService } from "../services/health.service";
import type { SystemHealth } from "../types/health";

export class HealthController {
	constructor(private healthService: HealthService) {}

	async getHealth(c: Context): Promise<SystemHealth> {
		const health = await this.healthService.checkHealth();
		return health;
	}
}
