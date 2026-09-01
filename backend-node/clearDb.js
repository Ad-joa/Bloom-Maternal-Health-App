"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function clearDatabase() {
    console.log('Clearing database...');
    // Delete symptom logs first due to foreign key constraint
    await prisma.symptom_logs.deleteMany();
    // Delete users
    await prisma.users.deleteMany();
    console.log('Database successfully cleared!');
}
clearDatabase()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=clearDb.js.map