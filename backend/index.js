import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API del TP3 funcionando')
})

app.listen(port, () => {
  console.log(`La aplicación está funcionando en ${port}`)
})
