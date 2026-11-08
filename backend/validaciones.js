import { param, validationResult } from 'express-validator'

// Validar ID recibido por parámetro
export const validarId = param('id')
  .isInt({ min: 1 })
  .withMessage('El ID debe ser un número entero positivo')

// Verificar el resultado de las validaciones
export const verificarValidaciones = (req, res, next) => {
  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Parámetros no válidos',
      errores: resultado.array()
    })
  }

  next()
}
