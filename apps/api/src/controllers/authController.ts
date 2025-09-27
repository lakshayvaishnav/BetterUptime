import type { Request, Response } from "express";
import z, { date, success } from "zod";
import userModel from "../models/userModel";
import { generateToken, getCookieOptions } from "../utils/jwt";
import type { LoginRequest, SignupRequest, AuthenticatedRequest } from "../types";

class AuthController {
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { email, name, password }: SignupRequest = req.body;

            // check if user already exists
            const existingUser = await userModel.getUserByEmail(email);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: "user already exists with this email"
                })
                return;
            }

            // create new user
            const user = await userModel.createUser({
                email: email,
                name: name,
                password: password
            })

            if (!user) {
                res.status(400).json({
                    success: false,
                    message: "failed to create user"
                })
                return;
            }

            // generate jwt token
            const token = generateToken({
                email: user.email,
                id: user.id
            })

            // set cookie
            res.cookie('token', token, getCookieOptions());

            res.status(201).json({
                success: true,
                message: "user registered successfully",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    token
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error : undefined
            });
        }
    }
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: LoginRequest = req.body;

            // find user by email
            const user = await userModel.getUserByEmail(email);

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Invalid credientials"
                })
                return;
            }

            // validate passowrd
            const isPassowrdValid = await userModel.validatePassword(password, user.hashedPassword);
            if (!isPassowrdValid) {
                res.status(401).json({
                    success: false,
                    message: "Invalid credentails"
                })
                return;
            }

            // generate jwt token
            const token = generateToken({
                id: user.id,
                email: user.email
            })

            // set cookie
            res.cookie('token', token, getCookieOptions())

            res.json({
                success: true,
                message: 'Login successfull',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    token
                }
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error : undefined
            })
        }
    }
    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.cookie('token', '', {
                expires: new Date(0),
                httpOnly: true
            });

            res.json({
                success: true,
                message: "Logout successfull"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "failed to logout"
            })
        }
    }
    async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const user = req.user;

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "user not authenticated"
                })
                return;
            }
            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }
}
