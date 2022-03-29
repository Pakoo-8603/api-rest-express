const express = require('express');
const Joi = require('joi') // Importa Joi
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:'Pakoo'},
    {id:2, nombre:'Pooki'},
    {id:3, nombre:'Fel'},
    {id:4, nombre:'Roler'}
];

ruta.get('/', (req, res) => {
    res.send('Hola');
});
ruta.get('/api/usuarios',(req, res) => {
    res.send(usuarios);
});

// Cómo pasar parámetros dentro de las rutas
// p. ej. Solo quiero un usario especifico en vez de todos
// Con los : delante del id Express
// sabe que es un parámetro a recibir
// http://localhost:5000/api/usuarios/1/1/sex='m'
ruta.get('/api/usuarios/:id', (req, res) => {
    // Devuelve el primer elemento del arreglo que cumple con la condición
    // parseInt hace el casteo a entero directo
    let usuario = existeUsuario(req.params.id);
    if(!usuario)
        res.status(404).send('Error: Usuario no encontrado');
    res.send(usuario);
    //res.send(req.query);
});
// ruta.get('/api/usuarios/:year/:month', (req, res) => {
//     res.send(req.params);
// });

// Tiene el mismo nobre que la petición GET
// Express hace la diferencia dependiendo del 
// tipo de petición
ruta.post('/api/usuarios/',(req, res) => {
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
ruta.put('/api/usuarios/:id', (req, res) => {
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
ruta.delete('/api/usuarios/:id', (req, res) => {
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

function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre:Joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom}));
}

module.exports = ruta; // Se exporta el objeto ruta