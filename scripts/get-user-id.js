const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserId() {
  try {
    const user = await prisma.user.findFirst();
    console.log('User ID:', user.id);
    console.log('User Email:', user.email);
    console.log('User Name:', user.name);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUserId();