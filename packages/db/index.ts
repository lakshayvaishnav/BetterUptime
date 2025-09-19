import { PrismaClient } from "./generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    // generate random user
    const randomUser = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
    };

    // pick a random URL
    const urls = [
        "https://youtube.com",
        "https://google.com",
        "https://github.com",
        "https://twitter.com",
        "https://openai.com",
    ];
    const randomUrl = faker.helpers.arrayElement(urls);

    // create user with monitor + check result
    const create_user = await prisma.user.create({
        data: {
            email: randomUser.email,
            name: randomUser.name,
            monitors: {
                create: {
                    url: randomUrl,
                    results: {
                        create: {
                            status: faker.datatype.boolean(),
                            responseTimeMs: faker.number.int({ min: 50, max: 1000 }),
                        },
                    },
                },
            },
        },
        include: {
            monitors: {
                include: {
                    results: true,
                },
            },
        },
    });

    console.log("✅ Created user successfully:", JSON.stringify(create_user, null, 2));
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
