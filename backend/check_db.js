
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.goal.count();
    const goals = await prisma.goal.findMany({ include: { steps: true } });
    console.log('Total Goals:', count);
    console.log('Goals List:', JSON.stringify(goals, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
