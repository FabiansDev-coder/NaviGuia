const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const verificarToken = require('../middlewares/verificarToken');

router.post('/login', login);

// Ejemplo de ruta protegida
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;
