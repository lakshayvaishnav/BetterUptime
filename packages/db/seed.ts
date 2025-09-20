import { faker } from "@faker-js/faker";
import { Location } from "./generated/prisma";
import { Status } from "./generated/prisma";
import { prismaclient } from "./index";

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

    const randomLocation = faker.helpers.arrayElement([
        Location.USA,
        Location.INDIA
    ])

    const randomStatus = faker.helpers.arrayElement([
        Status.Down,
        Status.Up
    ])

    // create user with monitor + check result
    const create_user = await prismaclient.user.create({
        data: {
            email: randomUser.email,
            name: randomUser.name,
            monitors: {
                create: {
                    url: randomUrl,
                    results: {
                        create: {
                            status: randomStatus,
                            responseTimeMs: faker.number.int({ min: 50, max: 1000 }),
                            Location: randomLocation
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
