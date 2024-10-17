import { mockDbCheck } from "../../shared/db/mockDb";
import type { HealthCheck, HealthStatus, SystemHealth } from "../types/health";

export class HealthService {
	private healthChecks: HealthCheck[] = [
		{
			name: "database",
			check: async () => {
				const result = await mockDbCheck();
				return {
					status: result.status === "ok" ? "healthy" : "unhealthy",
					component: "database",
					details: { message: result.message },
				};
			},
		},
		// Add more health checks here
	];

	async checkHealth(): Promise<SystemHealth> {
		const checks = await Promise.all(
			this.healthChecks.map((check) => check.check()),
		);
		const overallStatus = this.determineOverallStatus(
			checks.map((check) => check.status),
		);

		return {
			status: overallStatus,
			version: "v0",
			checks,
			timestamp: new Date().toISOString(),
		};
	}

	private determineOverallStatus(statuses: HealthStatus[]): HealthStatus {
		if (statuses.every((status) => status === "healthy")) return "healthy";
		if (statuses.some((status) => status === "unhealthy")) return "unhealthy";
		return "degraded";
	}
}
