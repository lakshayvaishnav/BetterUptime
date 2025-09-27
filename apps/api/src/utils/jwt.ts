import jwt from "jsonwebtoken";
import type { JWTPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("jwt secret env var is required");

export const generateToken = (payload: JWTPayload): string => {
    const res = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2d"
    })
    console.debug("✅ token generated :", res);
    return res;
}

export const verifyToken = (token: string): JWTPayload => {
    const res = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.debug("✅ token verified : ", res);
    return res;
}

/*
httpOnly: true
    Critical Security Feature!
    Prevents JavaScript from accessing the cookie via document.cookie
    Protects against XSS (Cross-Site Scripting) attacks
    Only the server can read/write this cookie

secure: process.env.NODE_ENV === 'production'
    Development: false - allows cookies over HTTP (http://localhost)
    Production: true - requires HTTPS (https://yoursite.com)
    Protects against man-in-the-middle attacks

sameSite: 'strict'
    Protects against CSRF (Cross-Site Request Forgery) attacks
    'strict' means the cookie is NEVER sent with cross-site requests

    SameSite Options:

    'strict': Most secure, never sent cross-site
    'lax': Sent with top-level navigation (like clicking a link)
    'none': Always sent (requires secure: true)

*/

export const getCookieOptions = () => {
    const expire = parseInt(process.env.COOKIE_EXPIRE || '2');

    return {
        expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict' as const,
    };

}