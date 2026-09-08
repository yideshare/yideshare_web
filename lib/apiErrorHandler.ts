import { NextResponse } from "next/server";

/**
 * Represents an API error with an associated HTTP status code.
 * Throw this within route handlers to return structured error responses.
 *
 * @param message - Human-readable error message returned to the client
 * @param status - HTTP status code, defaults to 400
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Wraps a route handler with centralized error handling.
 *
 * Catches any thrown errors and returns `{ error }` as JSON. If the error is
 * an {@link ApiError}, its status becomes the HTTP status code; anything else
 * becomes a 500 carrying a generic message.
 *
 * @param handler The route handler function to wrap
 * @param ctx Dynamic route parameters (e.g. the id from /users/[id])
 * @returns A new handler that catches and formats errors as JSON responses
 */
export function withApiErrorHandler<Ctx>(
  handler: (req: Request, ctx: Ctx) => Promise<Response>
) {
  return async function (req: Request, ctx: Ctx) {
    try {
      return await handler(req, ctx);
    } catch (error) {
      let statusCode: number;
      let errorMessage: string;

      if (error instanceof ApiError) {
        statusCode = error.status;
        errorMessage = error.message;
      } else {
        console.error("API Error:", error);
        statusCode = 500;
        errorMessage = "An unexpected error occurred";
      }
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  };
}
