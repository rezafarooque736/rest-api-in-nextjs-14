import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/apis/authMiddleware";
import { loggingMiddleware } from "./middlewares/apis/loggingMiddleware";

export default function middleware(request: NextRequest) {
  if (request.url.includes("/api/notes")) {
    const result = loggingMiddleware(request);
    console.log("Result: ", result.response);
  }

  const authResult = authMiddleware(request);
  if (!authResult.isValid) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
