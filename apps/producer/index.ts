import { prismaclient } from "db/client"
import { XBulkAdd } from "redis-stream/client";

async function producer() {

    // TODO : add limit of url and add a while
    const websiteUrl = await prismaclient.monitor.findMany({
        select: {
            id: true,
            url: true
        }
    });

    console.log("website url : ", websiteUrl)
    await XBulkAdd(websiteUrl);
    console.log("sucessfully added to the stream ✅");
}

producer();