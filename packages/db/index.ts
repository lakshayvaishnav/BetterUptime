import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient()

await prisma.user.create({
    data: {
        name: "John Dough",
        email: `john-${Math.random()}@example.com`,
    },
});


