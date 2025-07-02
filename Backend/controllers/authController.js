const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Discapacitado = require('../models/Discapacitado');
const Acompanante = require('../models/Acompanante');
const Conductor = require('../models/Conductor');

exports.login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    let user = await Discapacitado.findOne({ correo }) ||
               await Acompanante.findOne({ correo }) ||
               await Conductor.findOne({ correo });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const esValida = await bcrypt.compare(password, user.password);
    if (!esValida) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user._id, correo: user.correo }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};
