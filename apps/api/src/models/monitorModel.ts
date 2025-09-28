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

}

export default new MonitorModel();

// getUserMonitors
// createUserMonitor
// deleteUserMonitor
// getmonitorbyid
// updateusermonitor
// deleteallusermonitors