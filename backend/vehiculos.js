import express from 'express'
import { db } from './db.js'
import { validarId, verificarValidaciones } from './validaciones.js'

const router = express.Router()

// GET - Obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const [vehiculos] = await db.execute('SELECT * FROM vehiculos ORDER BY id')

    res.json(vehiculos)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensaje: 'Error al obtener los vehículos'
    })
  }
})

// GET - Obtener un vehículo por ID
router.get('/:id', validarId, verificarValidaciones, async (req, res) => {
  try {
    const id = Number(req.params.id)

    const [vehiculos] = await db.execute(
      'SELECT * FROM vehiculos WHERE id = ?',
      [id]
    )

    if (vehiculos.length === 0) {
      return res.status(404).json({
        mensaje: 'Vehículo no encontrado'
      })
    }

    res.json(vehiculos[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensaje: 'Error al obtener el vehículo'
    })
  }
})

export default router
