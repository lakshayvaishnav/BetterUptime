import { client, XBulkAck } from "redis-stream/client";
import { Location, prismaclient, Status } from "db/client"


const STREAM_KEY = "BetterUptime:Websites";
// TODO: for now hardcoded values
// find the solution to run 2 consumer groups and multiple workers concurrently
const GROUP = "india";
const CONSUMER = "worker-1";



async function workerLoop() {
    while (true) {
        const res = await client.xReadGroup(
            GROUP,
            CONSUMER,
            { key: STREAM_KEY, id: ">" },
            { COUNT: 5, BLOCK: 5000 } // block for 5s if no messages.
        )

        console.debug("⏳ consuming from stream : ", JSON.stringify(res, null, 2));

        // if no response check for pending entries list
        if (!res) {
            const pending = await client.xPending(STREAM_KEY, GROUP);
            console.debug("🔫 number of pending entries : ", pending.pending);

        }

        if (!res) continue;

        // collect results
        const results: {
            monitorId: string,
            eventId: string,
            url: string,
            status: Status,
            responseTime: number,
            checkedAt: Date,
            Location: Location,
        }[] = []

        const streams = res as {
            name: string,
            messages: { id: string, message: Record<string, string> }[];
        }[];

        for (const stream of streams) {
            for (const { id, message: fields } of stream.messages) {
                let url = "";

                if (fields.url) {
                    url = fields.url;
                }

                let monitorId = "";

                if (fields.id) {
                    monitorId = fields.id;
                }

                const start = Date.now();
                const status = await checkUptime(url);
                const end = Date.now();

                const responseTime = end - start;

                results.push({
                    monitorId: monitorId,
                    eventId: id,
                    url: url,
                    checkedAt: new Date(),
                    Location: Location.INDIA,
                    responseTime: responseTime,
                    status: status
                })
            }
        }

        try {
            // Bulk upload to database
            await prismaclient.checkResult.createMany({
                data: results.map(r => ({
                    monitorId: r.monitorId,
                    status: r.status,
                    Location: r.Location,
                    responseTimeMs: r.responseTime,
                    checkedAt: r.checkedAt
                }))
            });
            console.debug("✅ prisma bulk upload successfull")
        } catch (error) {
            console.error("bulk upload error : ", error)
        }


        // ack all processed messages
        if (results.length > 0) {
            try {
                const eventIds = results.map(r => r.eventId);
                const ackRes = await XBulkAck(GROUP, eventIds);
                console.log(`✅ Acknowledged ${ackRes} messages`)

            } catch (error) {
                console.error("bulk acknowledge error : ", error);
            }

        }

    }
}



// workerLoop();
const RECLAIMER = "pel-reclaimer"



async function reclaimLoop() {
    console.log("➡️ running reclaim loop.")
    while (true) {
        try {
            // check pending
            const pending = await client.xPending(STREAM_KEY, GROUP);


            if (pending.pending > 0) {
                // get some details
                const details = await client.xPendingRange(
                    STREAM_KEY,
                    GROUP,
                    "-", "+",
                    10
                );

                for (const entry of details) {

                    //  @ts-ignore
                    const { id, consumer, millisecondsSinceLastDelivery, _deliveriesCounter } = entry;

                    // if message stuck > 30s, reclaim it.
                    if (millisecondsSinceLastDelivery > 30000) {
                        const claimed = await client.xClaim(
                            STREAM_KEY,
                            GROUP,
                            RECLAIMER,
                            30000,
                            [id]
                        );

                        console.debug("🔫 claimed : ", JSON.stringify(claimed, null, 2));
                        // process the claimed message

                        // collect results and bulk uppload
                        const pelResults: {
                            monitorId: string,
                            eventId: string,
                            url: string,
                            status: Status,
                            responseTime: number,
                            checkedAt: Date,
                            Location: Location
                        }[] = [];
                        try {
                            
                        } catch (error) {

                        }
                    }
                }
            }
        } catch (error) {
            console.error("error in recalim loop : ", error);
        }
    }
}

reclaimLoop();

async function checkUptime(url: string) {
    let status: Status;
    try {
        const response = await fetch(url, { method: "GET" })
        if (response.ok) {
            status = Status.Up;
            return status;
        }
        else {
            status = Status.Down;
            return status;
        }
    } catch (error) {
        status = Status.Down;
        return status;
    }
}

async function createConsumerGroup() {
    const createGroup = await client.xGroupCreate(
        STREAM_KEY, GROUP, "$"
    );

    console.log("group created : ", createGroup);
}