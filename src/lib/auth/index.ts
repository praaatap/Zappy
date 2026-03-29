import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "zappy-secret-change-in-production";

export interface JWTPayload {
  id: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify a JWT token string.
 * Returns the decoded payload or null if invalid.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extract JWT token from a Request's Authorization header or cookie.
 * Returns the token string or null.
 */
export function getTokenFromRequest(req: Request): string | null {
  // Check Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Check cookie: token=<token>
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}

/**
 * Get the authenticated user from a Request.
 * Returns the JWTPayload or null if not authenticated.
 */
export function getUserFromRequest(req: Request): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}
