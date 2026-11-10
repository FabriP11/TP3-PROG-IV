import express from 'express'
import { db } from './db.js'
import {
  validarAutenticacion,
  validarId,
  validarConductor,
  verificarValidaciones
} from './validaciones.js'

const router = express.Router()

// GET - Obtener todos los conductores
router.get('/', validarAutenticacion, async (req, res) => {
  try {
    const [conductores] = await db.execute(
      'SELECT * FROM conductores ORDER BY id'
    )

    res.json(conductores)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensaje: 'Error al obtener los conductores'
    })
  }
})

// GET - Obtener un conductor por ID
router.get(
  '/:id',
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      const [conductores] = await db.execute(
        'SELECT * FROM conductores WHERE id = ?',
        [id]
      )

      if (conductores.length === 0) {
        return res.status(404).json({
          mensaje: 'Conductor no encontrado'
        })
      }

      res.json(conductores[0])
    } catch (error) {
      console.error(error)

      res.status(500).json({
        mensaje: 'Error al obtener el conductor'
      })
    }
  }
)

// POST - Registrar un conductor
router.post(
  '/',
  validarAutenticacion,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia
      } = req.body

      const [resultado] = await db.execute(
        `INSERT INTO conductores
        (nombre, apellido, numero_documento, numero_licencia,
         fecha_alta_licencia, fecha_vencimiento_licencia)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          nombre,
          apellido,
          numero_documento,
          numero_licencia,
          fecha_alta_licencia,
          fecha_vencimiento_licencia
        ]
      )

      res.status(201).json({
        mensaje: 'Conductor registrado correctamente',
        id: resultado.insertId
      })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          mensaje: 'El documento o número de licencia ya está registrado'
        })
      }

      console.error(error)

      res.status(500).json({
        mensaje: 'Error al registrar el conductor'
      })
    }
  }
)

// PUT - Modificar un conductor
router.put(
  '/:id',
  validarAutenticacion,
  validarId,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      const {
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia
      } = req.body

      // Verificar si existe el conductor
      const [conductores] = await db.execute(
        'SELECT id FROM conductores WHERE id = ?',
        [id]
      )

      if (conductores.length === 0) {
        return res.status(404).json({
          mensaje: 'Conductor no encontrado'
        })
      }

      // Actualizar los datos
      await db.execute(
        `UPDATE conductores
         SET nombre = ?, apellido = ?, numero_documento = ?,
             numero_licencia = ?, fecha_alta_licencia = ?,
             fecha_vencimiento_licencia = ?
         WHERE id = ?`,
        [
          nombre,
          apellido,
          numero_documento,
          numero_licencia,
          fecha_alta_licencia,
          fecha_vencimiento_licencia,
          id
        ]
      )

      res.json({
        mensaje: 'Conductor actualizado correctamente'
      })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          mensaje: 'El documento o número de licencia ya está registrado'
        })
      }

      console.error(error)

      res.status(500).json({
        mensaje: 'Error al actualizar el conductor'
      })
    }
  }
)

// DELETE - Eliminar un conductor
router.delete(
  '/:id',
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id)

      const [resultado] = await db.execute(
        'DELETE FROM conductores WHERE id = ?',
        [id]
      )

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: 'Conductor no encontrado'
        })
      }

      res.json({
        mensaje: 'Conductor eliminado correctamente'
      })
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          mensaje: 'No se puede eliminar un conductor con viajes registrados'
        })
      }

      console.error(error)

      res.status(500).json({
        mensaje: 'Error al eliminar el conductor'
      })
    }
  }
)

export default router
