import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { ApiHandler, ApiHandlerContext } from "./api";

export interface ServerDependencies {
  // API handlers to register
  apiHandlers: ApiHandler<object, object>[];
  // Additional context to pass to handlers (dependencies, etc.)
  apiContext: ApiHandlerContext;
}

export function createServer(deps: ServerDependencies) {
  // Create the app with OpenAPI support
  const app = new OpenAPIHono();

  // Add middleware
  app.use("*", logger());
  app.use("*", cors());

  // Add OpenAPI documentation endpoint
  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Mustadio API",
      description: "HTTP/JSON API for Final Fantasy Tactics Battle Ground data",
    },
  });

  // Add Swagger UI
  app.get("/docs", swaggerUI({ url: "/openapi.json" }));

  // Register API handlers
  for (const apiHandler of deps.apiHandlers) {
    const path = `/api/${apiHandler.operationName}/v${apiHandler.version}`;

    const route = createRoute({
      method: "post",
      path,
      request: {
        body: {
          content: {
            "application/json": {
              schema: apiHandler.requestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            "application/json": {
              schema: apiHandler.responseSchema,
            },
          },
          description: "Successful response",
        },
        400: {
          description: "Bad request - validation error",
        },
        500: {
          description: "Internal server error",
        },
      },
      summary: apiHandler.summary,
      description: apiHandler.description,
      tags: apiHandler.tags,
    });

    app.openapi(route, async (c) => {
      try {
        const requestBody = c.req.valid("json");
        const result = await apiHandler.handler(requestBody, deps.apiContext);
        return c.json(result);
      } catch (error) {
        console.error(`Error in ${apiHandler.operationName}:`, error);
        return c.json({ error: "Internal server error" }, 500);
      }
    });
  }

  return app;
}

export function startServer(app: OpenAPIHono, port: number) {
  console.log(`🚀 Starting server on port ${port}`);

  serve({
    fetch: app.fetch,
    port: Number(port),
  });

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📖 Health check: http://localhost:${port}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/api/test`);
  console.log(`📚 OpenAPI docs: http://localhost:${port}/openapi.json`);
  console.log(`📖 Swagger UI: http://localhost:${port}/docs`);
}
