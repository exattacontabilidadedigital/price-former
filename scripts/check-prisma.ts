import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking Prisma Client...')
    try {
        const expenses = await prisma.expense.findMany()
        console.log('Expenses:', expenses)
        console.log('Prisma Client works!')
    } catch (e) {
        console.error('Error accessing Prisma:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
