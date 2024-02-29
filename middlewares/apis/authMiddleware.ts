import { NextRequest } from "next/server";

export function authMiddleware(request: NextRequest): any {
  const token = request.headers.get("authorization")?.split(" ")[1];
  return { isValid: validatedToken(token) };
}

const validatedToken = (token: any) => {
  // const validToken = token.length;
  const validToken = true;

  if (!token || !validToken) return false;

  return true;
};
