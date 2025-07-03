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

📁 Backend
├── controllers
│   ├── acompananteController.js      # Controlador para el manejo de acompañantes
│   ├── authController.js            # Controlador para la autenticación de usuarios
│   ├── conductorController.js       # Controlador para el manejo de conductores
│   ├── discapacitadoController.js   # Controlador para el manejo de personas discapacitadas
│   └── verificacionController.js    # Controlador para la verificación de usuarios
├── middlewares
│   └── verificarToken.js            # Middleware para verificar el token de autenticación
├── models
│   ├── Acompanante.js              # Modelo de datos para acompañantes
│   ├── Conductor.js                # Modelo de datos para conductores
│   └── Discapacitado.js            # Modelo de datos para personas discapacitadas
├── routes
│   ├── acompananteRoutes.js        # Rutas para gestionar acompañantes
│   ├── authRoutes.js               # Rutas de autenticación
│   ├── conductorRoutes.js          # Rutas para gestionar conductores
│   ├── discapacitadoRoutes.js      # Rutas para gestionar personas discapacitadas
│   └── verificacionRoutes.js       # Rutas para la verificación de usuarios
├── uploads                         # Carpeta para subir archivos (fotos, documentos, etc.)
├── db.js                           # Configuración de la base de datos
├── index.js                        # Archivo principal que inicia el servidor
└── .env                            # Variables de entorno (como claves secretas, credenciales de DB, 

El Frontend contiene el código de la interfaz de usuario de la aplicación.

📁 Frontend
└── public
    ├── NaviGuiaAppA.jpeg           # Imagenes de formulario
    ├── NaviGuiaAppB.jpeg         
    ├── NaviGuiaAppC.jpeg          
└── src
    ├── assets
    │   └── NaviGuiaHome.jpg        # Imagen principal de la página de inicio
    ├── components
    │   ├── Botonesinicio.jsx       # Botones de inicio
    │   ├── BotonesModoOscuroVolver.jsx # Botón para modo oscuro y volver
    │   └── BotonesRuta.jsx         # Botones para rutas
    ├── Formularios
    │   ├── RegistroAcompanantes.jsx # Formulario de registro para acompañantes
    │   ├── RegistroConductores.jsx  # Formulario de registro para conductores
    │   └── RegistroDiscapacitados.jsx # Formulario de registro para personas discapacitadas
    ├── styles
    │   ├── Home.css                # Estilos para la página de inicio
    │   ├── index.css               # Estilos globales
    │   ├── inicio.css              # Estilos para la pantalla de inicio
    │   ├── light.css               # Estilos para modo claro
    │   ├── MapaCali.css            # Estilos para la página del mapa
    │   ├── PaginaRuta.css          # Estilos para la página de rutas
    │   └── Perfil.css              # Estilos para la página de perfil
    ├── stylesdark
    │   ├── dark.css                # Estilos para modo oscuro
    │   ├── iniciodark.css          # Estilos para la pantalla de inicio en modo oscuro
    │   └── PaginaRutadark.css      # Estilos para la página de rutas en modo oscuro
    ├── utils
    │   └── verificarCorreo.js      # Función para verificar el correo electrónico
    ├── Home.jsx                    # Componente principal de la página de inicio
    ├── index.js                    # Archivo principal de la app
    ├── inicioRegistro.js           # Componente de inicio de registro
    ├── login.jsx                   # Componente de login
    ├── MapaCali.jsx                # Componente para mostrar el mapa de Cali
    ├── PaginaRuta.jsx              # Componente para mostrar la página de rutas
    └── Perfil.jsx                  # Componente para mostrar el perfil del usuario

Licencia
MIT © FabiansDev-coder
