import { z } from "@hono/zod-openapi";
import { ApiHandler } from "./index";

// Request schema - expects an object with a "health" property
const HealthCheckRequestSchema = z.object({
  health: z.string().describe("Health status to check"),
});

// Response schema - returns the health value under "check" key
const HealthCheckResponseSchema = z.object({
  check: z.string().describe("The health check result"),
});

// Type inference from schemas
type HealthCheckRequest = z.infer<typeof HealthCheckRequestSchema>;
type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

/**
 * Health check API handler that echoes back the health parameter
 */
export const healthCheckHandler: ApiHandler<
  HealthCheckRequest,
  HealthCheckResponse
> = {
  operationName: "healthCheck",
  version: 1,
  requestSchema: HealthCheckRequestSchema,
  responseSchema: HealthCheckResponseSchema,
  summary: "Health Check",
  description:
    "Simple health check endpoint that echoes back the provided health status",
  tags: ["System"],

  handler: async (request) => {
    // Echo back the health parameter under the "check" key
    return {
      check: request.health,
    };
  },
};
