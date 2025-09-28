import type { AuthenticatedRequest } from "../types";

class MonitorController {
    async createUserMonitor(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
        } catch (error) {

        }
    }
}

export default new MonitorController();

// createUserMonitor
// deleteUserMonitor
// deleteuserAllMonitors

