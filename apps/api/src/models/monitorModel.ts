import { prismaclient, type Monitor } from "db/client";
import type { CreateMonitor } from "../types";

class MonitorModel {
    async getUserMonitors(userId: string): Promise<Monitor[] | null> {
        try {

            const res = await prismaclient.monitor.findMany({
                where: {
                    userId: userId
                }, include: {
                    results: {
                        take: 1,
                        orderBy: {
                            checkedAt: "desc"
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            console.debug("✅ monitors fetched: ", res);
            return res;

        } catch (error) {
            console.error("error fetching user monitors : ", error);
            throw new Error("Failed to fetch monitors")
        }

    }

    async createUserMontior(data: CreateMonitor): Promise<Monitor | null> {
        try {
            // TODO : check for valid url.

            // check for exisiting.
            const existingMonitor = await prismaclient.monitor.findFirst({
                where: {
                    userId: data.userId,
                    url: data.url
                }
            })

            if (existingMonitor) {
                throw new Error("Monitor already exsits for this url")
            }


            const res = await prismaclient.monitor.create({
                data: {
                    url: data.url,
                    userId: data.userId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })

            console.debug("✅ monitor created : ", res);
            return res;
        } catch (error) {
            console.error("Error creating monitor :", error);
            throw error;
        }
    }

    async deleteMonitor(monitorId: string, userId: string): Promise<Monitor | null> {
        try {
            const existingMonitor = await prismaclient.monitor.findFirst({
                where: {
                    id: monitorId,
                    userId: userId
                },
                include: {
                    results: true,
                }
            })

            if (!existingMonitor) {
                throw new Error("Montior not found or you don't have permission to delete it");
            }

            await prismaclient.checkResult.deleteMany({
                where: {
                    monitorId: monitorId
                }
            })

            const deleteMontior = await prismaclient.monitor.delete({
                where: {
                    id: monitorId
                }
            });
            console.debug("✅ monitor deleted : ", deleteMontior);
            return deleteMontior;
        } catch (error) {
            console.error("Error deleting monitor : ", error);
            throw error;
        }
    }

    async getMonitorById(monitorId: string, userId: string): Promise<Monitor | null> {
        try {
            const res = await prismaclient.monitor.findFirst({
                where: {
                    id: monitorId,
                    userId: userId
                },
                include: {
                    results: {
                        orderBy: {
                            checkedAt: "desc"
                        },
                        take: 50 // last 50 results
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })
            console.debug("✅ monitor fetched by id : ", res);
            return res;

        } catch (error) {
            console.error("Error fetching monitor by id : ", error);
            throw new Error("failed to fetch monitor");
        }
    }

    async deleteAllUserMonitors(userId: string): Promise<number> {
        try {
            await prismaclient.checkResult.deleteMany({
                where: {
                    monitor: {
                        userId: userId
                    }
                }
            });

            const result = await prismaclient.monitor.deleteMany({
                where: {
                    userId: userId
                }
            })

            console.debug("✅ deleted all monitors for user : ", result.count);
            return result.count;
        } catch (error) {
            console.error("Error deleting all user monitors", error);
            throw new Error("Failed to delete user monitors");
        }
    }


}

export default new MonitorModel();

// getUserMonitors
// createUserMonitor
// deleteUserMonitor
// getmonitorbyid
// deleteallusermonitors

// TODO :
// add the check for valid url
// updateusermonitor