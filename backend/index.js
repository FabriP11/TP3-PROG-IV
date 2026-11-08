import express from 'express'
import { conectarDB } from './db.js'
import vehiculosRouter from './vehiculos.js'

const app = express()
const port = 3000

app.use(express.json())

await conectarDB()

app.get('/', (req, res) => {
  res.json({ mensaje: 'API del TP3 funcionando correctamente' })
})

app.use('/vehiculos', vehiculosRouter)

app.listen(port, () => {
  console.log(`La aplicación está funcionando en ${port}`)
})
