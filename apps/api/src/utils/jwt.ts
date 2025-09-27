import jwt from "jsonwebtoken";
import type { JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("jwt secret env var is required");

export const generateToken = (payload: JWTPayload): string => {
    const res = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2h"
    })
    console.debug("✅ token generated :", res);
    return res;
}

export const verifyToken = (token: string): JWTPayload => {
    const res = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.debug("✅ token verified : ", res);
    return res;
}