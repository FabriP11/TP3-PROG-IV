import express from 'express'
import { db } from './db.js'
import {
  validarId,
  validarVehiculo,
  verificarValidaciones
} from './validaciones.js'

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

// POST - Registrar un vehículo
router.post('/', validarVehiculo, verificarValidaciones, async (req, res) => {
  try {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body

    const [resultado] = await db.execute(
      `INSERT INTO vehiculos
        (marca, modelo, patente, anio, capacidad_carga)
        VALUES (?, ?, ?, ?, ?)`,
      [marca, modelo, patente, anio, capacidad_carga]
    )

    res.status(201).json({
      mensaje: 'Vehículo registrado correctamente',
      id: resultado.insertId
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensaje: 'La patente ya está registrada'
      })
    }

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al registrar el vehículo'
    })
  }
})

export default router
