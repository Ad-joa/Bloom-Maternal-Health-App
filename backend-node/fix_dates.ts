import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function fixDates() {
  const users = await prisma.users.findMany({ where: { last_period_date: { not: null } } });
  let fixedCount = 0;
  for (const user of users) {
    if (!user.last_period_date) continue;
    const cleanedDate = user.last_period_date.trim().replace(/-/g, '/');
    const lmpParts = cleanedDate.split('/');
    if (lmpParts.length === 3) {
      const monthStr = lmpParts[0].trim().padStart(2, '0');
      const dayStr = lmpParts[1].trim().padStart(2, '0');
      const yearStr = lmpParts[2].trim();
      const lmpDate = new Date(\\-\-\T12:00:00Z\);
      if (!isNaN(lmpDate.getTime())) {
        const calculatedDueDate = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
        const month = String(calculatedDueDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(calculatedDueDate.getUTCDate()).padStart(2, '0');
        const year = calculatedDueDate.getUTCFullYear();
        const isoDueDate = \\-\-\\;
        const fixedLmp = \\/\/\\;
        if (user.due_date !== isoDueDate || user.last_period_date !== fixedLmp) {
          await prisma.users.update({
            where: { id: user.id },
            data: { due_date: isoDueDate, last_period_date: fixedLmp }
          });
          fixedCount++;
          console.log(\Fixed user \: LMP -> \, Due Date -> \\);
        }
      }
    }
  }
  console.log(\Finished fixing dates. Total users updated: \\);
}
fixDates().catch(console.error).finally(() => prisma.$disconnect());