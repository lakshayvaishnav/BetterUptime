import { createClient } from "redis";
import { prismaclient} from "db/client"

const redis = createClient();


async function producer() {

    const result = await prismaclient.user.findMany({});

    console.log("result : ", result);
}

producer();