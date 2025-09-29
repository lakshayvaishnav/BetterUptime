import monitorModel from "../models/monitorModel";
import type { AuthenticatedRequest, CreateMonitor } from "../types";
import type { Response } from "express";

class MonitorController {
    async createUserMonitor(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // fix the bug :  instead of params use req.user for the requests.
            const id = req.user!.id;

            if (!id) {
                res.status(401).json({
                    success: false,
                    message: "user not authenticated"
                })
                return;
            }

            let { userId, url }: CreateMonitor = req.body;
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
            const id = req.user!.id;

            if (!id) {
                res.status(401).json({
                    success: false,
                    message: "user not authenticated"
                })
                return;
            }

            let { monitorId } = req.params;

            if (!monitorId) {
                res.status(400).json({
                    success: false,
                    message: "invalid monitor id"
                })
                return;
            }

            const monitor = await monitorModel.deleteMonitor(monitorId, id);

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
            const id = req.user!.id;
            if (!id) {
                res.status(401).json({
                    success: false,
                    message: "user not authenticated"
                })
                return;
            }

            const result = await monitorModel.deleteAllUserMonitors(id);
            console.debug("✅ deleted all monitors : ", result);

            res.json({
                success: true,
                data: {
                    result
                },
                message: "all monitors deleted successfully"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
            console.debug("erro in delete all user monitor : ", error);
        }
    }

    async getAllUserMonitors(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const id = req.user?.id;
            if (!id) {
                res.status(401).json({
                    success: false,
                    message: "user not authenticated"
                })
                return;
            }
            const result = await monitorModel.getAllUserMonitors(id);

            console.debug("✅ fetched all monitors controller : ", result);

            res.json({
                success: true,
                data: {
                    result
                },
                message: "Fetched all monitors"
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
            console.debug("error in fetching all user monitors : ", error);
        }
    }

    async getMonitorById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { monitorId } = req.params;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "user not authenticated"
                })
                return;
            }

            if (!monitorId) {
                res.status(400).json({
                    success: false,
                    message: "Inalid monitor id"
                })
                return;
            }

            const result = await monitorModel.getMonitorById(monitorId, userId);
            console.debug("✅ fetched monitor id in controller : ", result);
            res.json({
                success: true,
                data: {
                    result
                },
                message: "successfully fetched the monitor"
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
            console.debug("error in get monitor by id controller : ", error);
        }
    }
}

export default new MonitorController();

// createUserMonitor
// deleteUserMonitor
// deleteuserAllMonitors

