import { z } from "@hono/zod-openapi";

// Export handlers
export { healthCheckHandler } from "./healthCheck";

/**
 * Generic API handler definition
 * @template TRequest - The request body type (inferred from requestSchema)
 * @template TResponse - The response body type (inferred from responseSchema)
 */
export interface ApiHandler<TRequest extends object, TResponse extends object> {
  /** The operation name - used in the URL path as /api/{operationName}/v{version} */
  operationName: string;

  /** The API version number */
  version: number;

  /** Zod schema for validating the request body */
  requestSchema: z.ZodType<TRequest>;

  /** Zod schema for validating the response body */
  responseSchema: z.ZodType<TResponse>;

  /**
   * The handler function that processes the request
   * @param request - The validated request body
   * @param context - Additional context (dependencies, etc.)
   * @returns The response body
   */
  handler: (
    request: TRequest,
    context: ApiHandlerContext
  ) => Promise<TResponse> | TResponse;

  /** Optional description for OpenAPI documentation */
  description?: string;

  /** Optional summary for OpenAPI documentation */
  summary?: string;

  /** Optional tags for OpenAPI documentation */
  tags?: string[];
}

/**
 * Context object passed to API handlers containing dependencies and request metadata
 */
export interface ApiHandlerContext {
  // Add any common dependencies or context here
  // For example: user authentication, database connections, etc.
  [key: string]: unknown;
}
