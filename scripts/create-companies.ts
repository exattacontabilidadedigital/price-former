import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCompanyForUsers() {
    try {
        // Find users without company
        const usersWithoutCompany = await prisma.user.findMany({
            where: { companyId: null },
        });

        console.log(`Found ${usersWithoutCompany.length} users without company`);

        for (const user of usersWithoutCompany) {
            // Create a company for the user
            const company = await prisma.company.create({
                data: {
                    name: `${user.name || 'Minha'} Empresa`,
                    cnpj: null,
                    address: null,
                },
            });

            // Associate user with the company
            await prisma.user.update({
                where: { id: user.id },
                data: { companyId: company.id },
            });

            console.log(`✅ Created company "${company.name}" for user ${user.email}`);
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createCompanyForUsers();
