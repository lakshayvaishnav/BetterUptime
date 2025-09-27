import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types";
import { verifyToken } from "../utils/jwt";
import userModel from "../models/userModel";

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // check for token in authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
            console.debug("✅ token found in auth header: ", token)
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
            console.debug("✅ token found in cookies", token)
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
            return;
        }

        const decoded = await verifyToken(token);
        const user = await userModel.getUserById(decoded.id);

        if (!user) {
            res.status(401).json({
                success: false,
                message: "invalid token. user not found. "
            });
            return;
        }
        console.debug("✅ user : ", user);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        })
        console.debug("errror : ", error);
    }
}
