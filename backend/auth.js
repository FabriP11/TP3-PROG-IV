import express from 'express'
import { db } from './db.js'
import { body } from 'express-validator'
import { verificarValidaciones } from './validaciones.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// POST - Iniciar sesión
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('El email no es válido'),

    body('contrasena').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  verificarValidaciones,
  async (req, res) => {
    try {
      const { email, contrasena } = req.body

      // Buscar usuario en la base de datos
      const [usuarios] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      )

      if (usuarios.length === 0) {
        return res.status(401).json({
          mensaje: 'Credenciales incorrectas'
        })
      }

      // Comparar la contraseña con el hash
      const usuario = usuarios[0]

      const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena
      )

      if (!contrasenaValida) {
        return res.status(401).json({
          mensaje: 'Credenciales incorrectas'
        })
      }

      // Generar token JWT
      const token = jwt.sign({ userId: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: '4h'
      })

      res.json({ token })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        mensaje: 'Error al iniciar sesión'
      })
    }
  }
)

export default router
