import express from 'express'
import { db } from './db.js'
import { body } from 'express-validator'
import { verificarValidaciones } from './validaciones.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// POST - Registrar un usuario
router.post(
  '/',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),

    body('email').isEmail().withMessage('El email no es válido'),

    body('contrasena')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres')
  ],
  verificarValidaciones,
  async (req, res) => {
    try {
      const { nombre, email, contrasena } = req.body

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 12)

      // Guardar usuario
      const [resultado] = await db.execute(
        `INSERT INTO usuarios (nombre, email, contrasena)
         VALUES (?, ?, ?)`,
        [nombre, email, hashedPassword]
      )

      res.status(201).json({
        mensaje: 'Usuario registrado correctamente',
        id: resultado.insertId,
        nombre,
        email
      })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          mensaje: 'El email ya está registrado'
        })
      }

      console.error(error)

      res.status(500).json({
        mensaje: 'Error al registrar el usuario'
      })
    }
  }
)

export default router
