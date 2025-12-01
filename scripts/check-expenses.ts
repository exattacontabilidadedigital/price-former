
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const expenses = await prisma.expense.findMany()
  console.log('Expenses in database:')
  console.table(expenses)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
