import express from 'express'
import { conectarDB } from './db.js'

const app = express()
const port = 3000

app.use(express.json())

await conectarDB()

app.get('/', (req, res) => {
  res.send('API del TP3 funcionando')
})

app.listen(port, () => {
  console.log(`La aplicación está funcionando en ${port}`)
})
