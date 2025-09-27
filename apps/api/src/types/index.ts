
import type { Request } from "express";

export interface LoginRequest {
    email: string,
    password: string,
}

export interface User {
    id: string,
    name: string,
    email: string,

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