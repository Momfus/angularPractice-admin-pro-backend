// Ejectuo el script de nodemon index.js con el "npm run start:dev" (escrito en package.json)

require('dotenv').config(); // Traer las variables de entorno en el archivo .env

const path = require('path'); // Viene de la parte de node para manejar rutas directamente

const express = require('express'); // Idem a importar librerias
const cors = require('cors'); // Se instala con "npm i cors" (sirve para hacer las configuraciones en el servidor para que acepte peticiones en diferentes dominios)
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Coonfigurar CORS
app.use( cors() ); // Esto es un middleware es una función que siempre se va a ejecutar de las lineas hacia abajo (en este caso siempre que haya una petición, ejecutara el cors)

// Carpeta pública
app.use( express.static('public') ); // Le dice al servidor express que cuando se llega al root del servidor, se use esta carpeta

// Lectura y parseo del body
app.use( express.json() ); // Antes de las rutas para que lo arme correctamente

// Base de datos
dbConnection();

/* Test mongodb user test

user: mean_user
pass: xZRhi568QG3BEJZ0

*/

// console.log( process.env ); // Para ver todas las variables de entorno (tanto las que definimos como las que ya estan en la libreria)

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes')); // La ruta seguido del controlador para saber que devolver
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/todo', require('./routes/busquedas.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

// Lo último si no es ninguna de las anteriroes rutas (al recargar la página en producción, generalmente envia como que no puede acceder a la ruta al no encontrar las anteriores)
app.get('*', (req, res) => {
   res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

app.listen( process.env.PORT, () => {
   console.log('Servidor corriendo en puerto ' + process.env.PORT);
} );