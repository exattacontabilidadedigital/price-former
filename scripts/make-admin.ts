import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeUserAdmin() {
    try {
        // Get the first user (or specify by email)
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            take: 1,
        });

        if (users.length === 0) {
            console.log('No users found to update');
            return;
        }

        const user = users[0];

        // Update to ADMIN
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
        });

        console.log(`✅ User ${user.email} is now ADMIN`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

makeUserAdmin();
