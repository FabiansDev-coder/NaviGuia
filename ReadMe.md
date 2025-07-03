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

Estructura del código o Esquema del proyecto

El Backend contiene la lógica de negocio y los servicios relacionados con la API.

Backend/
├── controllers/
│   ├── acompananteController.js      # Manejo de acompañantes
│   ├── authController.js             # Autenticación de usuarios
│   ├── conductorController.js        # Manejo de conductores
│   ├── discapacitadoController.js    # Manejo de personas discapacitadas
│   └── verificacionController.js     # Verificación de usuarios
├── middlewares/
│   └── verificarToken.js             # Middleware de autenticación
├── models/
│   ├── Acompanante.js                # Modelo de datos para acompañantes
│   ├── Conductor.js                  # Modelo de datos para conductores
│   └── Discapacitado.js              # Modelo de datos para discapacitados
├── routes/
│   ├── acompananteRoutes.js          # Rutas para acompañantes
│   ├── authRoutes.js                 # Rutas de autenticación
│   ├── conductorRoutes.js            # Rutas para conductores
│   ├── discapacitadoRoutes.js        # Rutas para discapacitados
│   └── verificacionRoutes.js         # Rutas de verificación de datos
├── uploads/                          # Carpeta para subir archivos (fotos, docs)
├── db.js                             # Configuración de base de datos
├── index.js                          # Archivo principal del servidor
└── .env                              # Variables de entorno

El Frontend contiene el código de la interfaz de usuario de la aplicación.

Frontend/
├── public/
│   ├── NaviGuiaAppA.jpeg             # Imagen de formulario
│   └── NaviGuiaAppC.jpeg
├── src/
│   ├── assets/
│   │   └── NaviGuiaHome.jpg          # Imagen principal de la página de inicio
│   ├── components/
│   │   ├── BotonesInicio.jsx         # Botones de inicio
│   │   ├── BotonesModoOscuroVolver.jsx # Botón para modo oscuro y volver
│   │   └── BotonesRuta.jsx           # Botones para rutas
│   ├── formularios/
│   │   ├── RegistroAcompanantes.jsx  # Formulario de acompañantes
│   │   ├── RegistroConductores.jsx   # Formulario de conductores
│   │   └── RegistroDiscapacitados.jsx# Formulario de discapacitados
│   ├── styles/
│   │   ├── Home.css                  # Estilos para página de inicio
│   │   ├── index.css                 # Estilos globales
│   │   ├── inicio.css                # Estilos pantalla de inicio
│   │   ├── light.css                 # Estilos modo claro
│   │   ├── dark.css                  # Estilos modo oscuro
│   │   ├── MapaCali.css              # Estilos del mapa
│   │   ├── PaginaRuta.css            # Estilos para página de ruta
│   │   └── Perfil.css                # Estilos perfil de usuario
│   ├── utils/
│   │   └── validaciones.js           # Funciones de validación
│   ├── Home.jsx                      # Componente principal de inicio
│   ├── index.js                      # Archivo principal del frontend
│   ├── inicioRegistro.jsx           # Componente de inicio de registro
│   ├── login.jsx                     # Componente de login
│   ├── MapaCali.jsx                  # Componente para mostrar mapa de Cali
│   ├── PaginaRuta.jsx                # Página de rutas
│   └── Perfil.jsx                    # Página de perfil del usuario

Licencia
MIT © FabiansDev-coder
