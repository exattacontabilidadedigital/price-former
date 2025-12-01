
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const taxes = await prisma.tax.findMany()
  console.log('Taxes in database:')
  console.table(taxes)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
