import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/light.css';
import './stylesdark/dark.css';

function Login() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [modoOscuro, setModoOscuro] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const mensajeRef = useRef(null);
  const navigate = useNavigate(); // <-- Agregado para redirección

  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [modoOscuro]);
  
  useEffect(() => {
    if (mensaje && mensajeRef.current) {
      mensajeRef.current.focus();
    }
  }, [mensaje]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.correo || !form.password) {
      setMensaje('Por favor, complete todos los campos.');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('¡Inicio de sesión exitoso!');
        setForm({ correo: '', password: '' });
        setTimeout(() => {
          navigate('/perfil'); // Redirige a Perfil.jsx después de login exitoso
        }, 1000);
      } else {
        setMensaje(data.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor');
    }
  };

  return (
    <>
      {/* Botones volver al inicio y modo oscuro juntos, alineados y centrados */}
        <div className="botones-contenedor">
          <button
            type="button"
            className="btn-volver-inicio"
            onClick={() => window.location.href = "/"}
            aria-label="Volver al inicio"
          >
            Volver al inicio
          </button>
          <button
            type="button"
            className="btn-modo-osc"
            onClick={() => setModoOscuro(!modoOscuro)}
            aria-pressed={modoOscuro}
            aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {modoOscuro ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>

      <div className="registro-container">
        <form onSubmit={handleSubmit} aria-labelledby="titulo-login">
          <h2 id="titulo-login">Inicio de Sesión</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label htmlFor="correo" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                required
                autoComplete="username"
                style={{ width: '100%', padding: '0.8rem', fontSize: '1.05rem', borderRadius: '6px', border: '1.5px solid #99ccff' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label htmlFor="password" style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ width: '100%', padding: '0.8rem', fontSize: '1.05rem', borderRadius: '6px', border: '1.5px solid #99ccff' }}
              />
            </div>
          </div>

          <div className="botones-envio" style={{marginTop: "1.4rem"}}>
            <button type="submit" className="btn-enviar" style={{fontSize: "18px"}}>
              Ingresar
            </button>
          </div>

          <div
            aria-live="polite"
            tabIndex={-1}
            ref={mensajeRef}
            style={{ outline: 'none', minHeight: '2.2rem', marginTop: '1rem' }}
          >
            {mensaje}
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;