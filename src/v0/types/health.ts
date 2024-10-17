import { z } from "zod";

export const HealthStatusSchema = z.enum(["healthy", "unhealthy", "degraded"]);
export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export const HealthCheckResultSchema = z.object({
	status: HealthStatusSchema,
	component: z.string(),
	details: z.record(z.unknown()).optional(),
});
export type HealthCheckResult = z.infer<typeof HealthCheckResultSchema>;

export const SystemHealthSchema = z.object({
	status: HealthStatusSchema,
	version: z.string(),
	checks: z.array(HealthCheckResultSchema),
	timestamp: z.string(),
});
export type SystemHealth = z.infer<typeof SystemHealthSchema>;

export const HealthCheckSchema = z.object({
	name: z.string(),
	check: z.function().returns(z.promise(HealthCheckResultSchema)),
});
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
