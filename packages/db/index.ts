import { PrismaClient } from "./generated/prisma";

// Export a singleton Prisma client
export const prismaclient = new PrismaClient();

// Also re-export enums and types from generated Prisma
export * from "./generated/prisma";
