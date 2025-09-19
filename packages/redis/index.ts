import { createClient } from "redis"
import type { WebsiteType } from "utils";

const client = createClient();

client.on("error", (err) => console.error("Redis Cient Error", err))

await client.connect();

const streamKey = process.env.STREAM_KEY || "BetterUptime:Websites"


// add a single website to redis stream
export async function XAdd(website: WebsiteType) {
    try {
        const res = await client.xAdd(
            streamKey, "*", {
            id: website.id,
            url: website.url
        }
        )

        console.log("website added to the stream : ", res)
        return res;
    } catch (error) {
        console.error("failed to add the website to the stream", error)
    }
};


// Bulk add multiple websites to redis stream
export async function XBulkAdd(websites: WebsiteType[]) {
    try {
        // use a pipeline for efficiency
        const pipeline = await client.multi();

        for (const website of websites) {
            pipeline.xAdd(streamKey, "*", {
                id: website.id,
                url: website.url
            })
        }

        const results = await pipeline.exec();
        console.log(` ✅ ${websites.length} websites added to the stream`);
        return results
    } catch (error) {
        console.error("Failed to bulk add websites to the stream : ", error);
    }
}