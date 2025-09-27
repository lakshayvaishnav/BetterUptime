import { prismaclient, type Monitor } from "db/client";

class MonitorModel {
    async getUserMonitor(userId: string): Promise<Monitor[] | null> {
        const res = await prismaclient.monitor.findMany({
            where: {
                userId: userId
            }
        })

        console.debug("✅ monitors : ", res);
        return res;
    }
}

export default new MonitorModel();