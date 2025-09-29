import { prismaclient, type CheckResult } from "db/client";

class ResultModel {
    async fetchResultByMonitorId(userId: string, monitorId: string): Promise<CheckResult[]> {
        try {
            const results = await prismaclient.checkResult.findMany({
                where: {
                    monitorId: monitorId,
                    monitor: {
                        userId: userId
                    }
                },
                orderBy: {
                    checkedAt: "desc"
                },
                take: 100,
                include: {
                    monitor: {
                        select: {
                            id: true,
                            url: true
                        }
                    }
                }
            });
            console.debug(`✅ Fetched ${results.length} results for monitor ${monitorId} "`)
            return results
        } catch (error) {
            console.error("❌ Error fetching results:", error);
            throw error;
        }
    }

    async fetchLatestResultByMonitorId(userId: string, monitorId: string): Promise<CheckResult | null> {
        try {
            const result = await prismaclient.checkResult.findFirst({
                where: {
                    monitorId: monitorId,
                    monitor: {
                        userId: userId
                    }
                },
                orderBy: {
                    checkedAt: "desc"
                }
            })

            if (!result) {
                console.debug(`⚠️ no results found for monitor ${monitorId}`)
                return null;
            }
            console.debug("✅ fetched latest result for monitor : ", result);
            return result;
        } catch (error) {
            console.error("❌ Error fetching latest result:", error);
            throw error;
        }
    }

    async deleteOldResults(userId: string, monitorId: string, olderThanDays: number = 90): Promise<number> {
        try {
            const monitor = await prismaclient.monitor.findFirst({
                where: {
                    id: monitorId,
                    userId: userId
                }
            })

            if (!monitor) {
                throw new Error("Monitor not found or you don't have permission to access it");
            }

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

            const result = await prismaclient.checkResult.deleteMany({
                where: {
                    monitorId: monitorId,
                    checkedAt: {
                        lt: cutoffDate
                    }
                }
            })
            console.debug(`✅ deleted ${result.count} old results for monitor : ${monitorId} `)
            return result.count
        } catch (error) {
            console.error("❌ Error deleting old results:", error);
            throw error;
        }
    }

}

export default new ResultModel();

// TODO :
// fetch results paginated
// fetch results filtered
// fetch results by date range
// get result stats by monitor id