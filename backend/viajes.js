import express from 'express'
import { db } from './db.js'
import {
  validarAutenticacion,
  validarId,
  validarViaje,
  verificarValidaciones
} from './validaciones.js'

const router = express.Router()

// GET - Obtener todos los viajes
router.get('/', validarAutenticacion, async (req, res) => {
  try {
    const [viajes] = await db.execute(
      `SELECT v.*, ve.marca, ve.modelo, ve.patente,
              c.nombre AS conductor_nombre,
              c.apellido AS conductor_apellido
       FROM viajes v
       INNER JOIN vehiculos ve ON v.vehiculo_id = ve.id
       INNER JOIN conductores c ON v.conductor_id = c.id
       ORDER BY v.fecha_salida DESC`
    )

    res.json(viajes)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensaje: 'Error al obtener los viajes'
    })
  }
})

// GET - Obtener un viaje por ID
router.get(
  '/:id',
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      const [viajes] = await db.execute(
        `SELECT v.*, ve.marca, ve.modelo, ve.patente,
                c.nombre AS conductor_nombre,
                c.apellido AS conductor_apellido
         FROM viajes v
         INNER JOIN vehiculos ve ON v.vehiculo_id = ve.id
         INNER JOIN conductores c ON v.conductor_id = c.id
         WHERE v.id = ?`,
        [id]
      )

      if (viajes.length === 0) {
        return res.status(404).json({
          mensaje: 'Viaje no encontrado'
        })
      }

      res.json(viajes[0])
    } catch (error) {
      console.error(error)

      res.status(500).json({
        mensaje: 'Error al obtener el viaje'
      })
    }
  }
)

// POST - Registrar un viaje
router.post(
  '/',
  validarAutenticacion,
  validarViaje,
  verificarValidaciones,
  async (req, res) => {
    try {
      const {
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones
      } = req.body

      const [resultado] = await db.execute(
        `INSERT INTO viajes
         (vehiculo_id, conductor_id, fecha_salida, fecha_llegada,
          origen, destino, kilometros, observaciones)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehiculo_id,
          conductor_id,
          fecha_salida.replace('T', ' '),
          fecha_llegada.replace('T', ' '),
          origen,
          destino,
          kilometros,
          observaciones ?? null
        ]
      )

      res.status(201).json({
        mensaje: 'Viaje registrado correctamente',
        id: resultado.insertId
      })
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          mensaje: 'El vehículo o conductor indicado no existe'
        })
      }

      console.error(error)

      res.status(500).json({
        mensaje: 'Error al registrar el viaje'
      })
    }
  }
)

export default router
