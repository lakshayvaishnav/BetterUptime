import type { Response } from "express";
import type { AuthenticatedRequest } from "../types";
import { success } from "zod";
import resultModel from "../models/resultModel";

class ResultController {
    async getResultsByMonitorId(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const authenticatedUserId = req.user?.id;

            if (!authenticatedUserId) {
                res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                })
                return;
            }

            const { monitorId } = req.params;

            if (!monitorId) {
                res.status(400).json({
                    success: false,
                    message: "Monitor id is required"
                })
                return;
            }

            const results = await resultModel.fetchResultByMonitorId(
                authenticatedUserId, monitorId
            )

            res.json({
                success: true,
                data: {
                    results,
                    count: results.length
                }
            })
        } catch (error: any) {
            console.error("Error in get results by monitor id : ", error);

            if (error.message?.includes("not found") || error.message?.includes("permission")) {
                res.status(404).json({
                    success: false,
                    message: "Monitor not found or you don't have permission to access it"
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: "internal server error"
            })
        }
    }

    async getLatestResult(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const authenticatedUserId = req.user?.id;

            if (!authenticatedUserId) {
                res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                })
                return;
            }

            const { monitorId } = req.params;

            if (!monitorId) {
                res.status(400).json({
                    success: false,
                    message: "Monitor id is required"
                })
                return;
            }

            const result = await resultModel.fetchLatestResultByMonitorId(authenticatedUserId, monitorId);

            if (!result) {
                res.status(401).json({
                    success: false,
                    message: "No results found for this monitor"
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    result
                }
            })
        } catch (error: any) {
            console.error("❌ Error in getLatestResult:", error);

            if (error.message?.includes("not found") || error.message?.includes("permission")) {
                res.status(404).json({
                    success: false,
                    message: "Monitor not found or you don't have permission to access it"
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    async deleteOldResults(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const authenticatedUserId = req.user?.id;
            if (!authenticatedUserId) {
                res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
                return;
            }

            const { monitorId } = req.params;

            const days = parseInt(req.query.days as string) || 90;
            if (!monitorId) {
                res.status(400).json({
                    success: false,
                    message: "Monitor ID is required"
                });
                return;
            }

            if (days < 1) {
                res.status(400).json({
                    success: false,
                    message: "Days must be a positive number"
                });
                return;
            }

            const deletedCount = await resultModel.deleteOldResults(authenticatedUserId, monitorId, days);

            res.json({
                success: true,
                message: `Deleted ${deletedCount} old results`,
                data: {
                    deletedCount,
                    olderThanDays: days
                }
            })

        } catch (error: any) {
            console.error("❌ Error in deleteOldResults:", error);

            if (error.message?.includes("not found") || error.message?.includes("permission")) {
                res.status(404).json({
                    success: false,
                    message: "Monitor not found or you don't have permission to access it"
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new ResultController();

// TODO :
// get paginated result
// get filtered result
// get result by date range
// get result stats
