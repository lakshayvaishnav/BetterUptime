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

        console.log("response from xreadgroup : ", JSON.stringify(res, null, 2));

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

workerLoop();

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