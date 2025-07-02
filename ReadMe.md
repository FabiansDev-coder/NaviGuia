# NaviGuía 🧭

**NaviGuía** es una plataforma inclusiva diseñada para conectar a personas con discapacidad visual con acompañantes voluntarios y conductores capacitados, promoviendo accesibilidad, movilidad segura y acompañamiento humano en entornos urbanos.

---

## 🚀 Tecnologías

- React.js + React Router DOM
- Base de Datos NoSql (Mongobd)
- Estilos con modo claro/oscuro (`light.css` y `dark.css`)
- Mapas: Leaflet + Mapbox GL
- Validaciones personalizadas (`utils/validaciones.js`)
- Accesibilidad optimizada con etiquetas `aria`, diseño responsivo y semántico

---

## 🧰 Instalación y ejecución

1. Clona el repositorio:

    ```bash
    git clone https://github.com/tuusuario/naviguia.git
    cd naviguia

2. Instala dependencias:
    npm install

3. Ejecuta la aplicación:
    npm start

✨ Funcionalidades principales
Registro por tipo de usuario:

Persona con discapacidad visual

Acompañante

Conductor

Formularios validados con:

Coincidencia de contraseñas

Nombres sin símbolos ni números

Correos únicos

Archivos y fechas en rango (conductores)

Navegación segura y redirección post-registro

Modo oscuro para accesibilidad visual

Verificación visual y auditiva de mensajes

Estilo adaptado a lectores de pantalla

📁 Estructura del código o Esquema del proyecto

📁 Backend
├── controllers
│   ├── acompananteController.js
│   ├── authController.js
│   ├── conductorController.js
│   ├── discapacitadoController.js
│   └── verificacionController.js
├── middlewares
│   └── verificarToken.js
├── models
│   ├── Acompanante.js
│   ├── Conductor.js
│   └── Discapacitado.js
├── routes
│   ├── acompananteRoutes.js
│   ├── authRoutes.js
│   ├── conductorRoutes.js
│   ├── discapacitadoRoutes.js
│   └── verificacionRoutes.js
├── uploads
├── db.js
├── index.js
└── .env

📁 Frontend
└── src
    ├── assets
    │   └── NaviGuiaHome.jpg
    ├── components
    │   ├── Botonesinicio.jsx
    │   ├── BotonesModoOscuroVolver.jsx
    │   └── BotonesRuta.jsx
    ├── Formularios
    │   ├── RegistroAcompanantes.jsx
    │   ├── RegistroConductores.jsx
    │   └── RegistroDiscapacitados.jsx
    ├── styles
    │   ├── Home.css
    │   ├── index.css
    │   ├── inicio.css
    │   ├── light.css
    │   ├── MapaCali.css
    │   ├── PaginaRuta.css
    │   └── Perfil.css
    ├── stylesdark
    │   ├── dark.css
    │   ├── iniciodark.css
    │   └── PaginaRutadark.css
    ├── utils
    │   └── verificarCorreo.js
    ├── Home.jsx
    ├── index.js
    ├── inicioRegistro.js
    ├── login.jsx
    ├── MapaCali.jsx
    ├── PaginaRuta.jsx
    └── Perfil.jsx

Licencia
MIT © FabiansDev-coder
