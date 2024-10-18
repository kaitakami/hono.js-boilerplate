import dotenv from "dotenv";
import pino from "pino";

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== "production";

export const pinoLogger = pino({
	level: isDevelopment ? "debug" : "info",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			ignore: "pid,hostname",
			translateTime: "SYS:standard",
		},
	},
});

type RequestLogData = {
	requestId: string;
	method: string;
	url: string;
	status: number;
	responseTime: string;
};

export const logger = {
	debug: isDevelopment ? pinoLogger.debug.bind(pinoLogger) : () => {},
	info: pinoLogger.info.bind(pinoLogger),
	warn: pinoLogger.warn.bind(pinoLogger),
	error: pinoLogger.error.bind(pinoLogger),
	request: (data: RequestLogData) =>
		pinoLogger.info({ type: "request", ...data }),
};
