"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const logs = await prisma.symptom_logs.findMany();
        console.log("Logs:", logs.length);
    }
    catch (error) {
        console.error("PRISMA ERROR:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test_prisma.js.map