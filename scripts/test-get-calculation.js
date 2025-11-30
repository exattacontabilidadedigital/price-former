const { getCalculation } = require('./src/app/actions/calculation-actions')

async function testGetCalculation() {
  try {
    console.log('Testando getCalculation...')
    const calculation = await getCalculation('635d510a-67a5-4500-9e57-daed08aed4ff')
    console.log('Resultado:', calculation)
    
    if (calculation) {
      console.log('✅ Cálculo encontrado!')
      console.log('- Nome:', calculation.calculationName)
      console.log('- Lucro Desejado:', calculation.desiredProfitMargin)
    } else {
      console.log('❌ Cálculo não encontrado')
    }
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testGetCalculation()