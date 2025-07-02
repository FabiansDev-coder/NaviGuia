import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesModoOscuroVolver from '../components/BotonesModoOscuroVolver';
import { verificarCorreo } from '../utils/verificarCorreo';
import '../styles/light.css';
import '../stylesdark/dark.css';

function FormularioAcompanantes() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    zona: "",
    experiencia: "",
    horarios: [],
    password: "",
    confirmPassword: ""
  });

  const [errores, setErrores] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    zona: "",
    experiencia: "",
    horarios: "",
    password: "",
    confirmPassword: ""
  });

  const [correoExistente, setCorreoExistente] = useState(false);
  const [validandoCorreo, setValidandoCorreo] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  // Validaciones
  const validarNombre = (nombre) => {
    if (!nombre.trim()) return "Este campo es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return "Solo se permiten letras y espacios";
    }
    return "";
  };

  const validarCorreo = (correo) => {
    if (!correo) return "Este campo es requerido";
    if (!correo.includes("@")) return "El correo debe contener al menos un @";
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regexCorreo.test(correo)) return "Debe terminar en .com, .co, etc.";
    return "";
  };

  const validarZona = (zona) => {
    if (!zona.trim()) return "Este campo es requerido";
    return "";
  };

  const validarExperiencia = (experiencia) => {
    if (!experiencia) return "Este campo es requerido";
    return "";
  };

  const validarHorarios = (horarios) => {
    if (horarios.length === 0) return "Debes seleccionar al menos un horario";
    return "";
  };

  const validarPassword = (pass) => {
    if (!pass) return "Este campo es requerido";
    if (/\s/.test(pass)) return "No se permiten espacios";
    if (pass.length < 6) return "Mínimo 6 caracteres";
    return "";
  };

  const validarConfirmPassword = useCallback((confirmPass) => {
    if (!confirmPass) return "Este campo es requerido";
    if (confirmPass !== formData.password) return "Las contraseñas no coinciden";
    return "";
  }, [formData.password]);

  useEffect(() => {
    if (formData.confirmPassword) {
      const error = validarConfirmPassword(formData.confirmPassword);
      setErrores(prev => ({ ...prev, confirmPassword: error }));
    }
  }, [formData.confirmPassword, validarConfirmPassword]);

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);
  }, [modoOscuro]);

  useEffect(() => {
    const timer = setTimeout(() => {
      verificarCorreo(formData.correo, setCorreoExistente, setValidandoCorreo);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.correo]);

  const filtrarSoloLetras = (texto) => {
    return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  let nuevoValor = value;

  // Filtrar caracteres especiales en nombre y apellido
  if (name === "nombre" || name === "apellido") {
    nuevoValor = filtrarSoloLetras(value);
  } else if (["correo", "password", "confirmPassword"].includes(name)) {
    nuevoValor = value.trim();
  }

  setFormData(prev => ({
    ...prev,
    [name]: nuevoValor
  }));

  let error = "";
  switch (name) {
    case "nombre":
    case "apellido":
      error = validarNombre(nuevoValor);
      break;
    case "correo":
      error = validarCorreo(nuevoValor);
      break;
    case "zona":
      error = validarZona(nuevoValor);
      break;
    case "experiencia":
      error = validarExperiencia(nuevoValor);
      break;
    case "password":
      error = validarPassword(nuevoValor);
      break;
    case "confirmPassword":
      error = validarConfirmPassword(nuevoValor);
      break;
    default:
      break;
  }

  setErrores(prev => ({
    ...prev,
    [name]: error
  }));
};

  const manejarEnvioFormulario = async () => {
  // Validar todos los campos requeridos
  const nuevosErrores = {
    nombre: validarNombre(formData.nombre),
    apellido: validarNombre(formData.apellido),
    correo: validarCorreo(formData.correo),
    zona: validarZona(formData.zona),
    experiencia: validarExperiencia(formData.experiencia),
    horarios: validarHorarios(formData.horarios),
    password: validarPassword(formData.password),
    confirmPassword: validarConfirmPassword(formData.confirmPassword)
  };

  setErrores(nuevosErrores);

  // Verificar si hay algún error
  const hayErrores = Object.values(nuevosErrores).some(error => error !== "");
  if (hayErrores || correoExistente) {
    return; // No envía si hay errores o si el correo ya existe
  }

  try {
    const response = await fetch('http://localhost:4000/api/RegistroAcompanantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setMensajeEnviado(true);
      setTimeout(() => {
        setMensajeEnviado(false);
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          zona: "",
          experiencia: "",
          horarios: [],
          password: "",
          confirmPassword: ""
        });
        navigate('/login');
      }, 1000);
    } else {
      alert("Error al registrar acompañante.");
    }
  } catch (err) {
    console.error("Error en la conexión:", err);
    alert("Error en la conexión con el servidor.");
  }
};
  return (
    <>
      <BotonesModoOscuroVolver modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <div className="registro-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Formulario de Registro</h2>

          <label>Nombre {errores.nombre && <span className="error-campo">* {errores.nombre}</span>}</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />

          <label>Apellido {errores.apellido && <span className="error-campo">* {errores.apellido}</span>}</label>
          <input 
            type="text" 
            name="apellido" 
            value={formData.apellido} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="correo">
            Correo electrónico:
            {errores.correo && <span className="error-campo"> * {errores.correo}</span>}
            {correoExistente && <span className="correo-registrado"> * Este correo ya está registrado</span>}
            {validandoCorreo && <span className="validando-correo"> </span>}
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // evita escribir espacios
            }}
            onPaste={(e) => {
              const textoPegado = e.clipboardData.getData("text");
              if (/\s/.test(textoPegado)) e.preventDefault(); // evita pegar texto con espacios
            }}
            required
          />
          <label>Contraseña {errores.password && <span className="error-campo">* {errores.password}</span>}</label>
          <input 
            ref={passwordRef} 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // evita escribir espacios
            }}
            onPaste={(e) => {
              const textoPegado = e.clipboardData.getData("text");
              if (/\s/.test(textoPegado)) e.preventDefault(); // evita pegar texto con espacios
            }}
            required 
          />

          <label>Confirmar contraseña {errores.confirmPassword && <span className="error-campo">* {errores.confirmPassword}</span>}</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault(); // evita escribir espacios
            }}
            onPaste={(e) => {
              const textoPegado = e.clipboardData.getData("text");
              if (/\s/.test(textoPegado)) e.preventDefault(); // evita pegar texto con espacios
            }}
            required
          />

          <label>Zona de disponibilidad {errores.zona && <span className="error-campo">* {errores.zona}</span>}</label>
          <input 
            type="text" 
            name="zona" 
            value={formData.zona} 
            onChange={handleChange} 
            required 
          />

          <label>
            ¿Tiene experiencia en acompañamiento para personas con discapacidad visual? 
            {errores.experiencia && <span className="error-campo"> * {errores.experiencia}</span>}
          </label>
          <select 
            name="experiencia" 
            value={formData.experiencia} 
            onChange={handleChange} 
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          <label>
            Horarios disponibles
            {errores.horarios && <span className="error-campo"> * {errores.horarios}</span>}
          </label>
          <div className="checkbox-group">
            {[
              "Mañana (6:00 AM - 10:00 AM)",
              "Mediodía (10:00 AM - 2:00 PM)",
              "Tarde (2:00 PM - 6:00 PM)",
              "Noche (6:00 PM - 10:00 PM)",
              "Fines de semana (Sabados y/o Domingos)",
              "Todos los días / todo el dia"
            ].map((rango) => (
              <label key={rango} className="horario-label">
                <span>{rango}</span>
                <input
                  type="checkbox"
                  name="horarios"
                  value={rango}
                  checked={formData.horarios.includes(rango)}
                  onChange={(e) => {
                    const nuevoValor = e.target.value;
                    setFormData((prevData) => {
                      const nuevosHorarios = prevData.horarios.includes(nuevoValor)
                        ? prevData.horarios.filter(h => h !== nuevoValor)
                        : [...prevData.horarios, nuevoValor];
                      return { ...prevData, horarios: nuevosHorarios };
                    });
                    setErrores((prev) => ({
                      ...prev,
                      horarios: ""
                    }));
                  }}
                />
              </label>
            ))}
          </div>

          <div className="botones-envio">
            <button 
              type="button" 
              className="btn-enviar"
              onClick={manejarEnvioFormulario}
            >
              Registrarse
            </button>
            <div className="texto-cuenta">
              ¿Ya tienes una cuenta?{' '}
              <button 
                type="button" 
                className="btn-iniciar-sesion"
                onClick={() => navigate("/login")}
              > 
                Inicia sesión
              </button>
            </div>
          </div>
          {mensajeEnviado}
        </form>
      </div>
    </>
  );
}

export default FormularioAcompanantes;
