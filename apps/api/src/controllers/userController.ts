import { success } from "zod";
import userModel from "../models/userModel";
import type { AuthenticatedRequest } from "../types";
import type { Response } from "express";

class UserController {
    async getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "invalid paramas id does not exist"
                })
                return;
            }
            const user = await userModel.getUserById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                    }
                }
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default new UserController();

