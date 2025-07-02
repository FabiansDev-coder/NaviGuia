const Acompanante = require('../models/Acompanante');
const bcrypt = require('bcrypt');

exports.registrarAcompanante = async (req, res) => {
  try {
    const { nombre, apellido, correo, zona, experiencia, horarios, password } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !apellido || !correo || !zona || !experiencia || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
    }

    // Verificar si el correo ya está en uso
    const existente = await Acompanante.findOne({ correo });
    if (existente) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    // Hashear la contraseña
    const passwordHasheado = await bcrypt.hash(password, 10);

    // Crear nuevo documento
    const nuevo = new Acompanante({
      nombre,
      apellido,
      correo,
      zona,
      experiencia,
      horarios: Array.isArray(horarios) ? horarios : [horarios].filter(Boolean),
      password: passwordHasheado
    });

    await nuevo.save();
    res.status(201).json({ message: 'Acompañante registrado con éxito' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar acompañante' });
  }
};
