import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("jwt secret env var is required");


export function signToken(payload: object, opts?: jwt.SignOptions) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h", ...(opts || {}) })
}

export function verifyToken<T = any>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
}