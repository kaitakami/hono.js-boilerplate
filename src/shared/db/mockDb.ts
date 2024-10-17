export async function mockDbCheck() {
	// Simulate a database check
	await new Promise((resolve) => setTimeout(resolve, 100));
	const isHealthy = Math.random() > 0.1; // 90% chance of being healthy
	return {
		status: isHealthy ? "ok" : "error",
		message: isHealthy
			? "Database connection successful"
			: "Database connection failed",
	};
}
