const Discapacitado = require('../models/Discapacitado');
const bcrypt = require('bcrypt');

exports.registrarDiscapacitado = async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre || !apellido || !correo || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const passwordHasheado = await bcrypt.hash(password, 10);

    const nuevo = new Discapacitado({
      nombre,
      apellido,
      correo,
      password: passwordHasheado
    });

    await nuevo.save();
    res.json({ message: 'Has sido registrado correctamente!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar en la base de datos' });
  }
};
