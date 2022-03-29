const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express'); // Importar express
const config = require('config');
const logger = require('./logger');
const morgan = require('morgan');
const app = express(); // Crea una instancia de express

// Middleware
// El middleware es un bloque de código que se ejecuta
// entre las peticiones del usuario (cliente) y el
// request que llega al servidor. Es un enlace entre la petición
// del usuario y el servidor, antes de que este pueda dar una respuesta

// Las funciones del middleware son funciones que tienen acceso
// al objeto de petición (request, req), el objeto de respuesta (response, res)
// y a la siguiente función de middleware en el ciclo de peticiones/respuestas
// normalmente con una variable denominada next.

// Las funciones de middleware pueden realizar las siguientes tareas:
//      - Ejecutar cualquier código
//      - Realizar cambios en la petición y los objetos de respuesta
//      - Finalizar el ciclo de peticiones/respuesta

// Express es un framework de diareccionamiento y de uso de middleware
// que permite que la aplicación tenga funcionalidad minima propia

// Ya usamos algunos middleware como express.json()
// transforma el body del req a formato JSON

//           -----------------------
// requesst -|-> json() --> route -|-> response
//           -----------------------

// route() --> funciones GET, POST PUT, DELETE

// JSON hace un parsing de la entrada en formato JSON
// De tal forma que lo que recibamos en el req  de una
// petición esté en formato JSON
app.use(express.json()); // Se le dice a express que use este middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
// public es el nombre de la carpeta que tendra los recursos estaticos.
console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`DB server: ${config.get('configDB.host')}`);

// Uso de middleware de tercero - morgan
if (app.get('env') == 'development'){
    app.use(morgan('tiny'));
    inicioDebug('Morgan esta habilitado');
}
// Operaciones con la base de datos
dbDebug('Conectado a la base de datos...');

// app.use(logger); // logger ya hace referencia a la función log (exports)
// Uso de middleware de tercero - morgan
// app.use(function(req, res, next){
//     console.log('Autenticando...');
//     next();
// });

// Query string
// url/?varl=valor1&var2=valor2&var3=valor3...

// Hay cuatro tipos de peticiones
// Asociada con las operaciones CRUD de una base de datos.
// app.get();  //Consulta de datos
// app.post(); // Envia datos al servidor
// app.put();  // Actualiza datos
// app.delete(); // Elimina datos

// Consulta en la ruta raíz de nuestro servidor
// con una función callback


// Usanado el módulo process, se lee una variable 
// de entorno.
// Si la variabe no existe, va a tomar un valor
// por default 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Escuchando en ${port}`);
});