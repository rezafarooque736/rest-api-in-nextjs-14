import { NextRequest } from "next/server";

export function loggingMiddleware(request: NextRequest) {
  return { response: request.method + " " + request.url };
}
