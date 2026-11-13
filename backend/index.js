import express from 'express'
import cors from 'cors'
import { conectarDB } from './db.js'
import vehiculosRouter from './vehiculos.js'
import conductoresRouter from './conductores.js'
import usuariosRouter from './usuarios.js'
import authRouter, { authConfig } from './auth.js'
import viajesRouter from './viajes.js'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

await conectarDB()
authConfig()

app.get('/', (req, res) => {
  res.json({ mensaje: 'API del TP3 funcionando correctamente' })
})

app.use('/vehiculos', vehiculosRouter)
app.use('/conductores', conductoresRouter)
app.use('/usuarios', usuariosRouter)
app.use('/auth', authRouter)
app.use('/viajes', viajesRouter)

app.listen(port, () => {
  console.log(`La aplicación está funcionando en ${port}`)
})
