import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesModoOscuroVolver from '../components/BotonesModoOscuroVolver';
import { verificarCorreo } from '../utils/verificarCorreo';
import '../styles/light.css';
import '../stylesdark/dark.css';

function FormularioDiscapacitados() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  });

  const [errores, setErrores] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  });

  const [modoOscuro, setModoOscuro] = useState(false);
  const [correoExistente, setCorreoExistente] = useState(false);
  const [validandoCorreo, setValidandoCorreo] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [reconocimientoActivo, setReconocimientoActivo] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [bloquearEventos, setBloquearEventos] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const pasoActualRef = useRef(pasoActual);
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const correoRef = useRef(null);
  const passwordRef = useRef(null);
  const resultadoVozRef = useRef('');

  const pasos = ['nombre', 'apellido', 'correo', 'password', 'registrar'];

  const instrucciones = {
    nombre: 'Gracias por preferir nuestra aplicacion, esperamos poder ayudarte al maximo. Para iniciar con el registro de tu cuenta. Por favor, indicanos tu nombre',
    apellido: 'Ahora por favor, di tu apellido.',
    correo: 'Ahora indica tu correo electrónico.',
    password: 'Ahora indica tu contraseña. Debe tener al menos 6 caracteres.',
    registrar: 'Registrando tu información.'
  };

  const referencias = {
    nombre: nombreRef,
    apellido: apellidoRef,
    correo: correoRef,
    password: passwordRef
  };

  const tiemposPorPaso = {
    nombre: 5000,
    apellido: 5000,
    correo: 12000,
    password: 10000
  };

  // Funciones de validación
  const validarNombre = (nombre) => {
    if (!nombre.trim()) return "Este campo es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return "Solo se permiten letras y espacios";
    }
    return "";
  };

  const validarCorreo = (correo) => {
    if (!correo) return "Este campo es requerido";
    if (!correo.includes("@")) return "El correo debe contener @";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
      return "Formato inválido (ej: usuario@dominio.com)";
    }
    return "";
  };

  const validarPassword = (password) => {
    if (!password) return "Este campo es requerido";
    if (/\s/.test(password)) return "No se permiten espacios";
    if (password.length < 6) return "Mínimo 6 caracteres";
    return "";
  };

  const manejarValidaciones = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
      case "apellido":
        error = validarNombre(value);
        break;
      case "correo":
        error = validarCorreo(value);
        break;
      case "password":
        error = validarPassword(value);
        break;
      default:
        break;
    }
    setErrores(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const resultado = event.results?.[0]?.[0]?.transcript.trim().toLowerCase();
        resultadoVozRef.current = resultado;
        if (resultado) {
          manejarResultado(resultado);
        }
      };

      recognition.onend = () => {
        const resultado = resultadoVozRef.current;
        if (!resultado) {
          const paso = pasos[pasoActualRef.current];
          const campo = paso === 'password' ? 'contraseña' : paso;
          hablar(`No se escuchó. Por favor, dinos tu ${campo}.`);
        } else {
          resultadoVozRef.current = ''; // Limpieza
        }
      };

      recognition.onerror = (event) => {
        hablar('Tal vez no se te escuchó. Por favor, intentalo de nuevo.');
        console.error('Reconocimiento error:', event.error);
      };

      recognitionRef.current = recognition;
    }

    setReconocimientoActivo(true);
    iniciarPaso(0);
    // eslint-disable-next-line
  }, [modoOscuro]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.correo) {
        verificarCorreo(formData.correo, setCorreoExistente, setValidandoCorreo);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.correo]);

  useEffect(() => {
    pasoActualRef.current = pasoActual;
  }, [pasoActual]);

  const hablar = (texto, callback = null, autoReconocer = true) => {
    setReconocimientoActivo(false);
    setBloquearEventos(true); 

    recognitionRef.current?.abort();

    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'es-ES';
    msg.onend = () => {
      setBloquearEventos(false); 
      if (callback) callback();
      if (autoReconocer) {
        setTimeout(() => iniciarReconocimiento(), 350);
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const iniciarPaso = (index) => {
    setPasoActual(index);
    const paso = pasos[index];
    const ref = referencias[paso];
    if (ref?.current) ref.current.focus();

    setTimeout(() => {
      hablar(instrucciones[paso]);
    }, 400);
  };

  const avanzarPaso = () => {
    setPasoActual(prevPaso => {
      const siguiente = Math.min(prevPaso + 1, pasos.length - 1);

      if (pasos[siguiente] === 'registrar') {
        setPasoActual(siguiente);
        recognitionRef.current?.abort();
        hablar(instrucciones.registrar, () => {
          setTimeout(manejarEnvioFormulario, 1000);
        }, false);
      } else {
        setTimeout(() => iniciarPaso(siguiente), 250);
      }

      return siguiente;
    });
  };

  useEffect(() => {
    if (
      formData.nombre &&
      formData.apellido &&
      formData.correo &&
      formData.password.length >= 6 &&
      !correoExistente &&
      pasoActual === pasos.length - 1 &&
      !mensajeEnviado
    ) {
      manejarEnvioFormulario();
    }
    // eslint-disable-next-line
  }, [formData, correoExistente, pasoActual]);

  const reproducirBeep = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const o = context.createOscillator();
    const g = context.createGain();

    o.type = 'sine';
    o.frequency.value = 1000;

    o.connect(g);
    g.connect(context.destination);

    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);

    o.stop(context.currentTime + 0.1);
  };

  let timeoutReconocimiento;

  const iniciarReconocimiento = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
      resultadoVozRef.current = '';
      recognitionRef.current.start();
      setReconocimientoActivo(true);

      const paso = pasos[pasoActualRef.current];
      const duracion = tiemposPorPaso[paso] || 7000;

      clearTimeout(timeoutReconocimiento);
      timeoutReconocimiento = setTimeout(() => {
        recognitionRef.current?.stop();
        setReconocimientoActivo(false);
        reproducirBeep();
      }, duracion);

    } catch (error) {
      console.error('Error iniciando reconocimiento:', error);
      hablar('Hubo un error iniciando el micrófono.');
    }
  };

  const formatearNombre = (texto) => {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, l => l.toUpperCase());
  };

  const manejarResultado = (resultado) => {
    const paso = pasos[pasoActualRef.current];
    switch (paso) {
      case 'nombre':
      case 'apellido':
        const valorLimpio = formatearNombre(resultado);
        if (!valorLimpio) {
          hablar(`El ${paso} no puede contener símbolos ni quedar vacío. Por favor, di tu ${paso} nuevamente.`, () => iniciarPaso(pasoActualRef.current));
        } else {
          setFormData(prev => ({ ...prev, [paso]: valorLimpio }));
          manejarValidaciones(paso, valorLimpio);
          avanzarPaso();
        }
        break;

      case 'correo': {
        let correo = resultado
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/arroba/g, '@')
          .replace(/punto/g, '.')
          .replace(/guionbajo|guion bajo/g, '_')
          .replace(/guion/g, '-');

        const tieneArroba = correo.includes('@');
        const tienePunto = correo.includes('.');
        const terminaConDominio = /\.(com|co|org|edu|net|gov|io|es)$/.test(correo);

        if (tieneArroba && tienePunto && terminaConDominio) {
          verificarCorreo(correo, (existe) => {
            if (existe) {
              setCorreoExistente(true);
              setErrores(prev => ({ ...prev, correo: "" }));
              hablar('Este correo ya está registrado. Por favor, di un correo diferente.', () => iniciarPaso(pasoActualRef.current));
            } else {
              setCorreoExistente(false);
              setFormData(prev => ({ ...prev, correo }));
              manejarValidaciones('correo', correo);
              avanzarPaso();
            }
          }, setValidandoCorreo);
        } else {
          setErrores(prev => ({ ...prev, correo: "" }));
          setErrores(prev => ({ ...prev, correo: "Formato de correo inválido" }));
          hablar('Ese correo no parece válido. Inténtalo de nuevo.', () => iniciarPaso(pasoActualRef.current));
        }
        break;
      }

      case 'password': {
        const passwordSinEspacios = resultado.replace(/\s+/g, '');

        if (passwordSinEspacios.length < 6) {
          setErrores(prev => ({ ...prev, password: "Mínimo 6 caracteres" }));
          hablar(
            'La contraseña debe tener al menos 6 caracteres y no debe contener espacios. Por favor, di tu contraseña nuevamente.',
            () => iniciarPaso(pasoActualRef.current)
          );
        } else {
          setFormData(prev => ({
            ...prev,
            password: passwordSinEspacios,
          }));
          manejarValidaciones('password', passwordSinEspacios);
          avanzarPaso();
        }
        break;
      }
      default:
        break;
    }
  };

  const manejarEnvioFormulario = async () => {
    // Verificar campos vacíos primero
    const camposVacios = {
      nombre: !formData.nombre.trim(),
      apellido: !formData.apellido.trim(),
      correo: !formData.correo.trim(),
      password: !formData.password.trim()
    };

    // Si hay campos vacíos, establecer errores y hablar
    if (Object.values(camposVacios).some(vacio => vacio)) {
      const nuevosErrores = {
        nombre: camposVacios.nombre ? "Este campo es requerido" : "",
        apellido: camposVacios.apellido ? "Este campo es requerido" : "",
        correo: camposVacios.correo ? "Este campo es requerido" : "",
        password: camposVacios.password ? "Este campo es requerido" : ""
      };
      setErrores(nuevosErrores);

      // Crear mensaje de voz con los campos faltantes
      const camposFaltantes = [];
      if (camposVacios.nombre) camposFaltantes.push("nombre");
      if (camposVacios.apellido) camposFaltantes.push("apellido");
      if (camposVacios.correo) camposFaltantes.push("correo electrónico");
      if (camposVacios.password) camposFaltantes.push("contraseña");

      let mensajeVoz = "Por favor completa los siguientes campos antes de registrar: ";
      mensajeVoz += camposFaltantes.join(", ");
      
      // Encontrar el primer campo vacío para enfocar
      const primerCampoVacio = Object.keys(camposVacios).find(key => camposVacios[key]);
      if (primerCampoVacio) {
        const paso = pasos.findIndex(p => p === primerCampoVacio);
        if (paso !== -1) {
          hablar(mensajeVoz, () => iniciarPaso(paso));
        }
      }
      return;
    }

    // Luego validar el formato de los campos
    const erroresActuales = {
      nombre: validarNombre(formData.nombre),
      apellido: validarNombre(formData.apellido),
      correo: validarCorreo(formData.correo),
      password: validarPassword(formData.password)
    };

    setErrores(erroresActuales);

    const hayErrores = Object.values(erroresActuales).some(error => error !== "");
    if (hayErrores || correoExistente) {
      if (correoExistente) {
        hablar('Este correo ya está registrado.', () => iniciarPaso(2));
      } else {
        // Crear mensaje de voz para errores de formato
        const erroresFormato = [];
        if (erroresActuales.nombre) erroresFormato.push("nombre");
        if (erroresActuales.apellido) erroresFormato.push("apellido");
        if (erroresActuales.correo) erroresFormato.push("correo electrónico");
        if (erroresActuales.password) erroresFormato.push("contraseña");

        let mensajeError = "Por favor corrige los siguientes campos: ";
        mensajeError += erroresFormato.join(", ");
        hablar(mensajeError);
      }
      return;
    }

    try {
      setCargando(true);
      const res = await fetch('http://localhost:4000/api/RegistroDiscapacitados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMensajeEnviado(true);
        hablar('¡Registro exitoso! Serás redirigido al inicio de sesión.', () => navigate('/login'), false);
      } else {
        const err = await res.json();
        hablar(`Error al registrar: ${err.message || 'Intenta más tarde'}`);
      }
    } catch (err) {
      console.error(err);
      hablar('Ocurrió un error al conectar con el servidor. Intenta más tarde.');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    manejarValidaciones(name, value);
  };

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Solo permitir letras y espacios para nombre y apellido
    if (name === 'nombre' || name === 'apellido') {
      if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        manejarValidaciones(name, value);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      manejarValidaciones(name, value);
    }
  };

  return (
    <>
      <BotonesModoOscuroVolver 
        modoOscuro={modoOscuro} 
        setModoOscuro={setModoOscuro} 
        bloquearEventos={bloquearEventos} 
        reconocimientoActivo={reconocimientoActivo}
      />

      <div className="registro-container">
        <form onSubmit={e => e.preventDefault()}>
          <h2>Formulario de Registro</h2>

          <label htmlFor="nombre">
            Nombre
            {errores.nombre && <span className="error-campo"> * {errores.nombre}</span>}
          </label>
          <input 
            ref={nombreRef} 
            type="text" 
            id="nombre" 
            name="nombre"  
            value={formData.nombre}  
            onChange={handleInputChange}
            onKeyDown={(e) => {
              // Bloquear teclas numéricas y especiales
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(e.key) && 
                  !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />

          <label htmlFor="apellido">
            Apellido
            {errores.apellido && <span className="error-campo"> * {errores.apellido}</span>}
          </label>
          <input 
            ref={apellidoRef} 
            type="text" 
            id="apellido" 
            name="apellido" 
            value={formData.apellido}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              // Bloquear teclas numéricas y especiales
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(e.key) && 
                  !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />

          <label htmlFor="correo">
            Correo electrónico:
            {errores.correo && <span className="error-campo"> * {errores.correo}</span>}
            {correoExistente && <span className="correo-registrado"> * Este correo ya está registrado</span>}
            {validandoCorreo && <span className="validando-correo"></span>}
          </label>
          <input 
            ref={correoRef} 
            type="email" 
            id="correo" 
            name="correo" 
            value={formData.correo} 
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
              }
            }}
            required 
          />

          <label htmlFor="password">
            Contraseña (mínimo 6 caracteres)
            {errores.password && <span className="error-campo"> * {errores.password}</span>}
          </label>
          <input
            ref={passwordRef}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault();
              }
            }}
            required
          />

          <div className="botones-envio">
            <button 
              type="button" 
              className="btn-enviar" 
              onClick={manejarEnvioFormulario} 
            >
              {'Registrarse'}
            </button>
            <div className="texto-cuenta">
              ¿Ya tienes una cuenta?{' '}
              <button 
                type="button" 
                className="btn-iniciar-sesion" 
                onClick={() => navigate('/login')} 
                disabled={cargando || reconocimientoActivo || bloquearEventos}
              >
                Inicia sesión
              </button>
            </div>
          </div>
        </form>
              <div className="contenedor-microfono">
        <button 
          aria-label="Activar micrófono para dictar información" 
          aria-describedby="instruccion-mic"  
          onClick={iniciarReconocimiento} 
          disabled={cargando} 
          className={`boton-microfono ${reconocimientoActivo ? 'activo' : ''}`}
        >
          <img
            src={reconocimientoActivo
              ? "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
              : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"}
            alt={reconocimientoActivo ? "Micrófono activo" : "Micrófono inactivo"}
            className="icono-microfono"
            aria-hidden="true"
          />
        </button>
        <span id="instruccion-mic" hidden>
          Presiona este botón para activar el micrófono. Luego, sigue las instrucciones habladas.
        </span>
        {cargando && <div className="cargando-voz"></div>}
      </div>
      </div>
    </>
  );
}

export default FormularioDiscapacitados;