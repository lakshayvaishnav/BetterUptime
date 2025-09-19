import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient()

async function main() {

    // creating a user
    const create_user = await prisma.user.create({
        data: {
            email: "lakshayvaishnav@gmail.com",
            name: "lakshay vaishnav",
            monitors: {
                create: {
                    url: "https://youtube.com",
                    results: {
                        create: {
                            status: false,
                            responseTimeMs: 100
                        }
                    }
                }
            },
        },
        include: {
            monitors: {
                include: {
                    results: true
                }
            }
        }
    })
    console.log("created user successfully : ", create_user);

}

main()
    .catch((e) => {
        console.error("❌ Error:", e)
    }).finally(async () => {
        await prisma.$disconnect();
    });

