import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesModoOscuroVolver from '../components/BotonesModoOscuroVolver';
import { verificarCorreo } from '../utils/verificarCorreo';
import '../styles/light.css';
import '../stylesdark/dark.css';

function FormularioConductores() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    documento: "",
    licenciaArchivo: null,
    placa: "",
    tipoVehiculo: "",
    soat: "",
    revision: "",
    telefono: "",
    correo: "",
    zona: "",
    password: "",
    confirmPassword: "",
    horarios: [] // Agrega esta línea
  });

  const [errores, setErrores] = useState({
    nombreCompleto: "",
    documento: "",
    licenciaArchivo: "",
    placa: "",
    telefono: "",
    soat: "",
    correo: "", 
    password: "",
    confirmPassword: ""
  });


  const [modoOscuro, setModoOscuro] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [errorRevision, setErrorRevision] = useState("");
  const [correoExistente, setCorreoExistente] = useState(false);
  const [validandoCorreo, setValidandoCorreo] = useState(false);
  const [fechaMin, setFechaMin] = useState('');
  const [fechaMax, setFechaMax] = useState('');
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  
  const validarFormulario = () => {
    const nuevosErrores = {
      nombreCompleto: validarNombre(formData.nombreCompleto),
      documento: validarDocumento(formData.documento),
      licenciaArchivo: validarLicencia(formData.licenciaArchivo),
      placa: validarPlaca(formData.placa),
      telefono: validarTelefono(formData.telefono),
      soat: validarSOAT(formData.soat),
      correo: validarCorreo(formData.correo),
      password: validarPassword(formData.password),
      confirmPassword: validarConfirmPassword(formData.confirmPassword),
      tipoVehiculo: validarTipoVehiculo(formData.tipoVehiculo),
      zona: validarZona(formData.zona),
      horarios: formData.horarios.length === 0 ? "Debes seleccionar al menos un horario" : ""
    };

    setErrores(nuevosErrores);

    // Verificar si hay algún error
    return !Object.values(nuevosErrores).some(error => error !== "");
  };

  // Validaciones
  const validarNombre = (nombre) => {
    if (!nombre.trim()) return "Este campo es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return "Solo se permiten letras y espacios";
    }
    return "";
  };

  const validarDocumento = (doc) => {
    if (!doc.trim()) return "Este campo es requerido";
    if (!/^\d+$/.test(doc)) return "Solo se permiten números (sin espacios ni símbolos)";
    if (doc.length < 6 || doc.length > 15) return "Debe tener entre 6 y 15 dígitos";
    return "";
  };

  const validarLicencia = (archivo) => {
    if (!archivo) return "Este campo es requerido";
    
    // Verificar si el archivo tiene la propiedad type (puede no estar presente en algunos navegadores)
    if (archivo.type) {
      const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(archivo.type)) {
        return "Solo se permiten archivos PDF, JPG o PNG";
      }
    } else {
      // Validación alternativa para navegadores que no soportan file.type
      const extension = archivo.name.split('.').pop().toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(extension)) {
        return "Solo se permiten archivos PDF, JPG o PNG";
      }
    }
    
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB
    if (archivo.size > tamanoMaximo) {
      return "El archivo no debe exceder los 5MB";
    }
    
    return "";
  };

  const validarPlaca = (placa) => {
    if (!placa.trim()) return "Este campo es requerido";
    if (!/^[a-zA-Z]{2,4}\d{2,4}$/.test(placa)) {
      return "Formato inválido (ej: ABC123)";
    }
    return "";
  };

  const validarTelefono = (tel) => {
    if (!tel.trim()) return "Este campo es requerido";
    if (!/^\d+$/.test(tel)) return "Solo se permiten números";
    if (tel.length !== 10) return "Debe tener exactamente 10 dígitos";
    return "";
  };

  const validarSOAT = (soat) => {
    if (!soat.trim()) return "Este campo es requerido";
    if (!/^[a-zA-Z0-9]{10,20}$/.test(soat)) {
      return "Formato inválido (10-20 caracteres alfanuméricos)";
    }
    return "";
  };

  const validarTipoVehiculo = (tipo) => {
    if (!tipo.trim()) return "Este campo es requerido";
    return "";
  };

  const validarZona = (zona) => {
    if (!zona.trim()) return "Este campo es requerido";
    return "";
  };

  const validarCorreo = (correo) => {
    if (!correo) return "Este campo es requerido";

    if (!correo.includes("@")) {
      return "El correo debe contener al menos un @";
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regexCorreo.test(correo)) {
      return "Debe terminar en .com, .co, etc.";
    }

    return "";
  };

  const validarPassword = (pass) => {
    if (!pass) return "Este campo es requerido";
    if (/\s/.test(pass)) {
      return "No se permiten espacios";
    }
    if (pass.length < 6) {
      return "Mínimo 6 caracteres";
    }
    return "";
  };

  const validarConfirmPassword = useCallback((confirmPass) => {
    if (!confirmPass) return "Este campo es requerido";
    if (confirmPass !== formData.password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  }, [formData.password]);

  useEffect(() => {
    if (formData.confirmPassword) {
      const error = validarConfirmPassword(formData.confirmPassword);
      setErrores(prev => ({ ...prev, confirmPassword: error }));
    }
  }, [formData.confirmPassword, validarConfirmPassword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      verificarCorreo(formData.correo, setCorreoExistente, setValidandoCorreo);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.correo]);

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);

    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    const haceUnAno = new Date();
    haceUnAno.setFullYear(hoy.getFullYear() - 1);

    const formato = (fecha) => fecha.toISOString().split('T')[0];

    const min = formato(haceUnAno);
    const max = formato(manana);

    setFechaMin(min);
    setFechaMax(max);

    setFormData((prevData) => ({
      ...prevData,
      revision: max
    }));
  }, [modoOscuro]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    let nuevoValor;
    let error = "";

    if (files) {
      nuevoValor = files[0];
      // Validación específica para el archivo de licencia
      if (name === "licenciaArchivo") {
        error = validarLicencia(nuevoValor);
      }
    } else {
      // Solo nombre y zona permiten espacios internos
      if (name === "nombreCompleto" || name === "zona") {
        nuevoValor = value; // sin trim()
      } else {
        nuevoValor = value.replace(/\s/g, ""); // quita todos los espacios
      }

      // Validaciones para otros campos
      switch (name) {
        case "nombreCompleto":
          error = validarNombre(nuevoValor);
          break;
        case "documento":
          error = validarDocumento(nuevoValor);
          break;
        case "placa":
          error = validarPlaca(nuevoValor.toUpperCase());
          break;
        case "telefono":
          error = validarTelefono(nuevoValor);
          break;
        case "soat":
          error = validarSOAT(nuevoValor);
          break;
        case "correo":
          error = validarCorreo(nuevoValor);
          break;
        case "password":
          error = validarPassword(nuevoValor);
          break;
        case "confirmPassword":
          error = validarConfirmPassword(nuevoValor);
          break;
        case "zona":
          error = validarZona(nuevoValor);
          break;
        default:
          break;
      }
    }

    setFormData({
      ...formData,
      [name]: nuevoValor
    });

    setErrores({
      ...errores,
      [name]: error
    });
  };

   const manejarEnvioFormulario = async () => {
    // Validar todos los campos primero
    const formularioValido = validarFormulario();
    
    if (!formularioValido) {
      // No continuar si hay errores
      return;
    }

    if (correoExistente) {
      alert('Este correo ya está registrado. Por favor usa otro.');
      return;
    }

    const fechaRevision = new Date(formData.revision);
    const fechaMinDate = new Date(fechaMin);
    const fechaMaxDate = new Date(fechaMax);

    if (fechaRevision < fechaMinDate || fechaRevision > fechaMaxDate) {
      setErrorRevision(`La fecha debe estar entre ${fechaMin} y ${fechaMax}.`);
      return;
    } else {
      setErrorRevision("");
    }

    const data = new FormData();
    for (let key in formData) {
      if (key === 'horarios') {
        // Para el array de horarios, agregamos cada valor por separado
        formData.horarios.forEach(horario => {
          data.append('horarios[]', horario);
        });
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('http://localhost:4000/api/RegistroConductores', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        setMensajeEnviado(true);
        setTimeout(() => {
          setMensajeEnviado(false);
          setFormData({
            nombreCompleto: "",
            documento: "",
            licenciaArchivo: null,
            placa: "",
            tipoVehiculo: "",
            soat: "",
            revision: "",
            telefono: "",
            correo: "",
            zona: "",
            password: "",
            confirmPassword: "",
            horarios: [] 
          });
          navigate('/login');
        }, 1000);
      } else {
        alert("Error al registrar conductor.");
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

          <label>Nombre completo {errores.nombreCompleto && <span className="error-campo">* {errores.nombreCompleto}</span>}</label>
          <input 
            type="text" 
            name="nombreCompleto" 
            value={formData.nombreCompleto} 
            onChange={handleChange} 
            required 
          />

          <label>Documento de identidad {errores.documento && <span className="error-campo">* {errores.documento}</span>}</label>
            <input 
              type="text" 
              name="documento" 
              value={formData.documento} 
              onChange={(e) => {
                // Filtra solo números en el cambio
                const soloNumeros = e.target.value.replace(/\D/g, '');
                handleChange({
                  target: {
                    name: e.target.name,
                    value: soloNumeros
                  }
                });
              }}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && 
                    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const textoPegado = e.clipboardData.getData('text/plain').replace(/\D/g, '');
                if (textoPegado) {
                  const nuevoValor = (formData.documento + textoPegado).slice(0, 15); // Asegura no pasar el maxLength
                  setFormData(prev => ({
                    ...prev,
                    documento: nuevoValor
                  }));
                }
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={15}
              required
            />

          <label>
              Adjuntar licencia de conducción 
              {errores.licenciaArchivo && <span className="error-campo">* {errores.licenciaArchivo}</span>}
            </label>
            <input 
              type="file" 
              name="licenciaArchivo" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleChange} 
              required 
              className={errores.licenciaArchivo ? 'input-error' : ''}
            />
            {formData.licenciaArchivo && (
              <div className="file-info">
                <span> Tu archivo pesa: {(formData.licenciaArchivo.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
            <span className="instrucciones-archivo">Formatos aceptados: PDF, JPG, PNG (máx. 5MB)</span>

          <label>Número de placa del vehículo {errores.placa && <span className="error-campo">* {errores.placa}</span>}</label>
          <input 
          type="text" 
          name="placa" 
          value={formData.placa.toUpperCase()} 
          onChange={handleChange}
          onKeyDown={(e) => {
            if (!/[a-zA-Z0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          maxLength={7}
          required 
          placeholder="ABC123"
        />

          <label>Tipo de vehículo {errores.tipoVehiculo && <span className="error-campo">* {errores.tipoVehiculo}</span>}</label>
          <input 
            type="text" 
            name="tipoVehiculo" 
            value={formData.tipoVehiculo} 
            onChange={handleChange} 
            required 
          />

          <label>Seguro obligatorio (SOAT) {errores.soat && <span className="error-campo">* {errores.soat}</span>}</label>
          <input 
            type="text" 
            name="soat" 
            value={formData.soat} 
            onChange={handleChange} 
            required 
          />

          <label>Última fecha de revisión técnico-mecánica</label>
          <input
            type="date"
            name="revision"
            value={formData.revision}
            onChange={handleChange}
            required
            min={fechaMin}
            max={fechaMax}
          />
          {errorRevision && <p className="mensaje-error">{errorRevision}</p>}

          <label>Teléfono {errores.telefono && <span className="error-campo">* {errores.telefono}</span>}</label>
          <input 
            type="tel" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            maxLength={10}
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
              if (e.key === " ") e.preventDefault(); // bloquea espacio
            }}
            onPaste={(e) => {
              const texto = e.clipboardData.getData("text");
              if (/\s/.test(texto)) e.preventDefault(); // bloquea si el texto tiene espacios
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
            required 
          />

          <label>Confirmar contraseña {errores.confirmPassword && <span className="error-campo">* {errores.confirmPassword}</span>}</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
          />

          <label>Zona de cobertura {errores.zona && <span className="error-campo">* {errores.zona}</span>}</label>
          <input 
            type="text" 
            name="zona" 
            value={formData.zona} 
            onChange={handleChange} 
            required 
          />
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
              <button type="button" className="btn-iniciar-sesion" onClick={() => navigate('/login')}>
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

export default FormularioConductores;