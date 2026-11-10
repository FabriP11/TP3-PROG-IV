import express from 'express'
import { db } from './db.js'
import {
  validarAutenticacion,
  validarId,
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

export default router
