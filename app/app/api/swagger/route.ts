import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "BISP API",
    version: "1.0.0",
    description:
      "OpenAPI documentation for all BISP backend API routes. Auth-protected routes require the `next-auth.session-token` cookie (obtained by signing in).",
  },
  servers: [{ url: "/", description: "Current origin" }],
  tags: [
    { name: "auth", description: "Authentication and registration" },
    { name: "chat", description: "AI chat with SQL generation (streaming SSE)" },
    { name: "clickhouse", description: "Database schema and query execution" },
    { name: "conversation", description: "Conversation management" },
    { name: "user", description: "User account information" },
    { name: "stripe", description: "Subscription billing via Stripe" },
    { name: "upload", description: "File upload and schema extraction" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
        description:
          "NextAuth.js session cookie. Sign in via /sign-in to obtain. In production (HTTPS) the cookie name is `__Secure-next-auth.session-token`.",
      },
    },
    schemas: {
      ErrorEnvelope: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          message: { type: "string" },
        },
        required: ["success", "message"],
      },
      MessageErrorEnvelope: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
      SchemaColumn: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string" },
        },
        required: ["name", "type"],
      },
      SchemaTable: {
        type: "object",
        properties: {
          table: { type: "string" },
          columns: {
            type: "array",
            items: { $ref: "#/components/schemas/SchemaColumn" },
          },
        },
        required: ["table", "columns"],
      },
      BlobFile: {
        type: "object",
        properties: {
          name: { type: "string" },
          url: { type: "string" },
        },
        required: ["name", "url"],
      },
      Message: {
        type: "object",
        properties: {
          role: { type: "string", enum: ["user", "assistant"] },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["role", "content", "createdAt"],
      },
      Conversation: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          title: { type: "string" },
          messages: {
            type: "array",
            items: { $ref: "#/components/schemas/Message" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["_id", "userId", "title", "messages"],
      },
      UIMessage: {
        type: "object",
        description: "Vercel AI SDK UIMessage shape",
        properties: {
          id: { type: "string" },
          role: { type: "string", enum: ["user", "assistant", "system", "tool"] },
          content: { type: "string" },
        },
        required: ["role", "content"],
        additionalProperties: true,
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string", enum: ["ok"] } },
                },
              },
            },
          },
          "400": {
            description: "Missing fields or password too short",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "409": {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/auth/{nextauth}": {
      get: {
        tags: ["auth"],
        summary: "NextAuth.js handler (GET)",
        description:
          "NextAuth.js catch-all route. Handles OAuth callbacks, CSRF tokens, session retrieval. Do not call directly.",
        parameters: [
          {
            name: "nextauth",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "NextAuth sub-path (e.g. callback/google, session, csrf)",
          },
        ],
        responses: {
          "200": { description: "Varies by sub-path" },
        },
      },
      post: {
        tags: ["auth"],
        summary: "NextAuth.js handler (POST)",
        description:
          "NextAuth.js catch-all route. Handles sign-in, sign-out, and OAuth POST callbacks. Do not call directly.",
        parameters: [
          {
            name: "nextauth",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Varies by sub-path" },
        },
      },
    },
    "/api/chat": {
      post: {
        tags: ["chat"],
        summary: "Send a chat message and stream AI response",
        description:
          "Streams an AI response as Server-Sent Events (SSE) using the Vercel AI SDK UI message stream format. The AI executes a fixed tool pipeline: translator → generator → executor (SQL). Requires an active session.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  messages: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UIMessage" },
                    description: "Conversation history",
                  },
                  url: {
                    type: "string",
                    description: "Database connection URL. Required if blobs not provided.",
                  },
                  blobs: {
                    type: "array",
                    items: { $ref: "#/components/schemas/BlobFile" },
                    description: "Uploaded file blobs. Required if url not provided.",
                  },
                },
                required: ["messages"],
              },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Server-Sent Events stream (text/event-stream). Each chunk is a `data:` prefixed line following the Vercel AI SDK UI message stream protocol.",
            content: {
              "text/event-stream": {
                schema: { type: "string" },
              },
            },
          },
          "400": {
            description: "Missing both url and blobs, or schema load failure",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "401": {
            description: "Unauthorized — no active session",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "403": {
            description: "Query quota exhausted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/clickhouse/schema": {
      get: {
        tags: ["clickhouse"],
        summary: "Load database schema",
        description: "Detects the database type from the connection URL and returns the full schema.",
        parameters: [
          {
            name: "url",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Database connection URL",
          },
        ],
        responses: {
          "200": {
            description: "Schema loaded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SchemaTable" },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing url parameter",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/clickhouse/query": {
      post: {
        tags: ["clickhouse"],
        summary: "Execute a SQL query",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: { type: "string", description: "SQL query to execute" },
                  url: { type: "string", description: "Database connection URL" },
                },
                required: ["query", "url"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Query executed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: { type: "array", items: {} },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing connection URL",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/conversation": {
      get: {
        tags: ["conversation"],
        summary: "List conversations for a user",
        parameters: [
          {
            name: "user_id",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "User ID",
          },
        ],
        responses: {
          "200": {
            description: "Conversations retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Conversation" },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing user_id",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/conversation/create": {
      post: {
        tags: ["conversation"],
        summary: "Create a new conversation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string", minLength: 1 },
                  title: { type: "string" },
                },
                required: ["userId"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Conversation created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: { $ref: "#/components/schemas/Conversation" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/conversation/{id}": {
      get: {
        tags: ["conversation"],
        summary: "Get a conversation by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conversation found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: { $ref: "#/components/schemas/Conversation" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Conversation not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["conversation"],
        summary: "Update conversation title",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Conversation updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: { $ref: "#/components/schemas/Conversation" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing title",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "404": {
            description: "Conversation not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["conversation"],
        summary: "Delete a conversation",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Conversation deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Conversation not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/conversation/{id}/message": {
      post: {
        tags: ["conversation"],
        summary: "Add a message to a conversation",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { $ref: "#/components/schemas/Message" },
                },
                required: ["message"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message added, returns updated conversation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    data: { $ref: "#/components/schemas/Conversation" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "404": {
            description: "Conversation not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/user/queries": {
      get: {
        tags: ["user"],
        summary: "Get remaining query count for the current user",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Query count retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    queriesCount: { type: "number" },
                  },
                  required: ["queriesCount"],
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/stripe/checkout": {
      post: {
        tags: ["stripe"],
        summary: "Create a Stripe checkout session for a subscription",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  plan: {
                    type: "string",
                    enum: ["pro", "max", "team"],
                    description: "Subscription plan to purchase",
                  },
                },
                required: ["plan"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout session created — redirect the user to the returned URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string", description: "Stripe checkout session URL" },
                  },
                  required: ["url"],
                },
              },
            },
          },
          "400": {
            description: "Invalid or missing plan",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
        },
      },
    },
    "/api/stripe/webhook": {
      post: {
        tags: ["stripe"],
        summary: "Stripe webhook receiver",
        description:
          "Called by Stripe to deliver subscription events. Verifies the `stripe-signature` header before processing. Do not call this endpoint directly.",
        parameters: [
          {
            name: "stripe-signature",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "Stripe webhook signature for payload verification",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/octet-stream": {
              schema: {
                type: "string",
                format: "binary",
                description: "Raw Stripe event payload",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Event received and processed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    received: { type: "boolean", enum: [true] },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing or invalid stripe-signature",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
    "/api/upload": {
      post: {
        tags: ["upload"],
        summary: "Upload an Excel file and extract schema",
        description:
          "Converts the uploaded Excel/XLSX file to CSV blobs and extracts the table schema. Returns a fileId, schema, and blob URLs for use with /api/chat.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Excel (.xlsx) file to upload",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "File processed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    fileId: { type: "string", format: "uuid" },
                    fileName: { type: "string" },
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SchemaTable" },
                    },
                    blobs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/BlobFile" },
                    },
                  },
                  required: ["success", "fileId", "fileName", "schema", "blobs"],
                },
              },
            },
          },
          "400": {
            description: "No file provided",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageErrorEnvelope" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorEnvelope" },
              },
            },
          },
        },
      },
    },
  },
};

export function GET() {
  return NextResponse.json(spec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
