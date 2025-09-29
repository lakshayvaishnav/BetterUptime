import { success } from "zod";
import monitorModel from "../models/monitorModel";
import type { AuthenticatedRequest, CreateMonitor } from "../types";
import type { Response } from "express";

class MonitorController {
    async createUserMonitor(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            let { userId, url }: CreateMonitor = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "invalid params id does not exists"
                })
                return;
            }

            userId = id;

            if (!url) {
                res.status(400).json({
                    success: false,
                    message: "invalid url or url does not exist"
                })
            }

            const monitor = await monitorModel.createUserMontior({ userId: id, url });

            console.debug("✅ monitor created successfully in controler : ", monitor);

            res.json({
                success: true,
                data: {
                    monitor
                }
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            })
            console.debug("error in create user monitor : ", error);
        }
    }

    async deleteUserMonitor(req : AuthenticatedRequest, res :Response) : Promise<void> {
        
    }
}

export default new MonitorController();

// createUserMonitor
// deleteUserMonitor
// deleteuserAllMonitors

