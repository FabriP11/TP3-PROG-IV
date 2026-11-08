import { body, param, validationResult } from 'express-validator'

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

// Validaciones para crear vehículos
export const validarVehiculo = [
  body('marca').trim().notEmpty().withMessage('La marca es obligatoria'),

  body('modelo').trim().notEmpty().withMessage('El modelo es obligatorio'),

  body('patente')
    .trim()
    .notEmpty()
    .withMessage('La patente es obligatoria')
    .bail()
    .isLength({ max: 20 })
    .withMessage('La patente no puede superar los 20 caracteres')
    .toUpperCase(),

  body('anio')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('El año del vehículo no es válido'),

  body('capacidad_carga')
    .isFloat({ gt: 0 })
    .withMessage('La capacidad de carga debe ser mayor a cero')
]
