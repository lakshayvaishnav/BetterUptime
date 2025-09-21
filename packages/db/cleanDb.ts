import { prismaclient } from "./index";

async function cleanDatabase() {
    try {
        console.log("Starting database cleanup...");


        console.log("deleting results");
        await prismaclient.checkResult.deleteMany({});

        console.log("deleting monitors");
        await prismaclient.monitor.deleteMany({});

        console.log("deleting users");
        await prismaclient.user.deleteMany({});
        
        console.log("Database cleaned successfully!");
    } catch (err) {
        console.error("Error cleaning database:", err);
    } finally {
        await prismaclient.$disconnect();
    }
}

// Run the script
cleanDatabase();
