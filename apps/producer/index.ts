import { prismaclient } from "db/client";
import { XBulkAdd } from "redis-stream/client";

let running = false;

async function producerOnce() {
  if (running) {
    console.log("producer already running, skipping this tick");
    return;
  }
  running = true;
  try {
    const websiteUrl = await prismaclient.monitor.findMany({
      select: { id: true, url: true },
    });

    if (websiteUrl.length === 0) return;

    const CHUNK = 500; // tune
    for (let i = 0; i < websiteUrl.length; i += CHUNK) {
      const chunk = websiteUrl.slice(i, i + CHUNK);
      try {
        await XBulkAdd(chunk); // assume this pushes multiple messages
        console.log(`✅ pushed chunk ${i/CHUNK + 1}`);
      } catch (err) {
        console.error("failed to push chunk, will retry once", err);
        // simple retry
        try { await XBulkAdd(chunk); console.log("retry ok"); }
        catch (err2) { console.error("retry failed", err2); /* notify/alert */ }
      }
    }
  } finally {
    running = false;
  }
}

producerOnce().catch(console.error);
setInterval(() => producerOnce().catch(console.error), 3 * 60 * 1000);
