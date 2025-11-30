const { auth } = require('./src/auth')

async function debugSession() {
  try {
    console.log('=== DEBUGGING SESSION ===')
    const session = await auth()
    console.log('Session:', JSON.stringify(session, null, 2))
    console.log('=== END DEBUG ===')
  } catch (error) {
    console.error('Error:', error)
  }
}

debugSession()