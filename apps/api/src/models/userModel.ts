import { prismaclient } from "db/client";

export async function createUser(data: { email: string, name: string, hashedPassword: string }) {

    const res = await prismaclient.user.create({ data });
    return res;
}

export async function getUserById(id: string) {
    const res = await prismaclient.user.findFirst({
        where: {
            id: id
        }
    })

    return res;
}

