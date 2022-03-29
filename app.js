const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express'); // Importar express
const config = require('config');
const logger = require('./logger');
const morgan = require('morgan');
const Joi = require('joi') // Importa Joi
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

const usuarios = [
    {id:1, nombre:'Pakoo'},
    {id:2, nombre:'Pooki'},
    {id:3, nombre:'Fel'},
    {id:4, nombre:'Roler'}
];

app.get('/', (req, res) => {
    res.send('Hola');
});
app.get('/api/usuarios',(req, res) => {
    res.send(usuarios);
});

// Cómo pasar parámetros dentro de las rutas
// p. ej. Solo quiero un usario especifico en vez de todos
// Con los : delante del id Express
// sabe que es un parámetro a recibir
// http://localhost:5000/api/usuarios/1/1/sex='m'
app.get('/api/usuarios/:id', (req, res) => {
    // Devuelve el primer elemento del arreglo que cumple con la condición
    // parseInt hace el casteo a entero directo
    let usuario = existeUsuario(req.params.id);
    if(!usuario)
        res.status(404).send('Error: Usuario no encontrado');
    res.send(usuario);
    //res.send(req.query);
});
// app.get('/api/usuarios/:year/:month', (req, res) => {
//     res.send(req.params);
// });

// Tiene el mismo nobre que la petición GET
// Express hace la diferencia dependiendo del 
// tipo de petición
app.post('/api/usuarios/',(req, res) => {
    //let body = req.body;
    //console.log(body.nombre);
    //res.json({
    //    body
    //});
    const {value, error} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id:usuarios.length +1,
            nombre:req.body.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
        return
    }
})

// Petición PUT
// Método para actualizar información
// Recibe el id del usuario que se quiere modificar
// Utilizando un parámetro de la ruta :id
app.put('/api/usuarios/:id', (req, res) => {
    // Validar que el usuario se encuentre
    // en los registros
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Error: Usuario no encontrado');
        return;
    }
    // En el body del request debe venir la información
    // para hacer la actualización
    // Validar que el nombre cumpla con las condiciones
    const {value, error} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message;
        res.status(404).send(mensaje)
        return;
    }
    // Actualiza el nombre de usuario
    usuario.nombre = value.nombre;
    res.send(usuario)
});

// Petición DELETE
// Método para eliminar información
// Recibe el id del usuario que se quiere eliminar
// Utilizando un parámetro de la ruta :id
app.delete('/api/usuarios/:id', (req, res) => {
    const usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Error: Usuario no encontrado');
        return;
    }
    // Encontrar  el indice del usuario dentro del arreglo
    // Devuelve el indice de la primera ocurrencia del elemento
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1) // Elimiina el elemnto en el indice indicado
    res.send(usuario) // Responde con el usuario eleiminado
});

// Usanado el módulo process, se lee una variable 
// de entorno.
// Si la variabe no existe, va a tomar un valor
// por default 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Escuchando en ${port}`);
});


function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre:Joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom}));
}