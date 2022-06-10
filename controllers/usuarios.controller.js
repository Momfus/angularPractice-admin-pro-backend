const { response } = require('express');
const Usuario = require('../models/usuario.model');

// Funciones para exportar
const getUsuarios = async (req, res) => {

   const usuarios= await Usuario.find({}, // Esperar a que obtenga los usuarios (se puede especificar para que devuelva lo que me interesa nomás)
      'nombre email role google'   
   ); 

   res.json( {

      ok: true,
      usuarios // usuarios: usuarios

   } );

};
const crearUsuario = async(req, res = response ) => { // "response" se trae de libreria de express para que tenga los autocompletados generales (como los usados en el catch de más abajo)

   const { email, password, nombre } = req.body;


   // Manejo de errores generales
   try {

      // Manejar errores como que hay un usuario duplicado por un campo único (email)
      const existeEmail = await Usuario.findOne({ email }); // Trae el campo email del body

      if( existeEmail ) {
         return res.status(400).json({
            ok: false,
            msg: "El correo ingresado ya esta registrado"
         });
      }

      const usuario = new Usuario( req.body );

      await usuario.save(); // Con await se espera que la promesa save se termine primero (para usarlo debe estar en una función async)
   
      res.json( {
   
         ok: true,
         usuario // colocarlo solo, si se llaman igual, es lo mismo que colocar usuario: usuario
   
      } );

   } catch(error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Error inesperado. Revisar logs'
      })

   }


};

module.exports = {
   getUsuarios,
   crearUsuario
};