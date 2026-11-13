import 'dotenv/config'
import { app } from './app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🐑 OvejaNegra backend corriendo en http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`)
})
