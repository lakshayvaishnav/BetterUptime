
import type { Request } from "express";
import type { User } from "db/client";

export interface LoginRequest {
    email: string,
    password: string,
}

export interface userType {
    id : string,
    email : string,
    name : string,
}

export interface SignupRequest {
    email: string,
    name: string,
    password: string
}

export interface JWTPayload {
    id: string,
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User
}