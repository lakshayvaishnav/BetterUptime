export interface LoginRequest {
    email: string,
    password: string,
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