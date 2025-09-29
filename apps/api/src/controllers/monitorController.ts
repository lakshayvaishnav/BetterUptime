import { success } from "zod";
import monitorModel from "../models/monitorModel";
import type { AuthenticatedRequest, CreateMonitor } from "../types";
import type { Response } from "express";

class MonitorController {
    async createUserMonitor(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // fix the bug instead of params use req.user for the requests.
            const  id  = req.user!.id;
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

    async deleteUserMonitor(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            let { monitorId, userId } = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "invalid params id does not exists"
                })
                return;
            }

            userId = id;

            const monitor = await monitorModel.deleteMonitor(monitorId, userId);

            console.debug("✅ monitor deleted successfully in controller : ", monitor);

            res.json({
                success: true,
                message: "monitor deleted successfully"
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internval server error",
            })
            console.debug("error in delete user monitor : ", error);
        }
    }

    async deleteAllUserMonitor(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "invalid params id does not exists"
                    })
                    return;
                }
            }

            const result = await monitorModel.deleteAllUserMonitors(id);
            console.debug("✅ deleted all monitors : ", result);

            res.json({
                success: true,
                messaeg: "all monitors deleted successfully"
            })
        } catch (error) {

        }
    }

    async getAllUserMonitors(req : AuthenticatedRequest, res : Response) : Promise<void> {
        try {
            const {} = req.user?.id;

        } catch (error) {
            
        }
    }
}

export default new MonitorController();

// createUserMonitor
// deleteUserMonitor
// deleteuserAllMonitors

