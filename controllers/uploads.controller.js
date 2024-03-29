const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid'); // npm install uuid
const { actualizarImagen, validateMongoID } = require('../helpers/actualizar-imagen');


const fileUpload = ( req, res = response ) => {


   const tipo = req.params.tipo;
   const id = req.params.id;

   // Primero se verifica si el ID es un tipo valido
   if( !validateMongoID(id) ) {
      return res.status(400).json({
         ok: false,
         msg: 'El ID es incorrecto'
      });
   } 

   /// Verificar si es un tipo válido de la tabla
   const tiposValidos = ['hospitales', 'medicos', 'usuarios'];   

   if( !tiposValidos.includes(tipo) ) {
      return res.status(400).json({
         ok:false,
         msg: 'No es un médico, usuario u hospital (tipo)'
      });
   }

   // Validar que exista un archivo
   if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
         ok: false,
         msg: 'No hay archivo alguno'
      });
   
   }

   // Procesar imagen
   const file = req.files.imagen; // El files viene grascias al middleware establecido en la ruta del expressFileUpload

   const nombreCortado = file.name.split('.'); // Generar y extraer el tipo de archivo
   const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];  // Obtiene el último que termina con el punto.

   // Validar extensiones
   const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

   if( !extensionesValidas.includes( extensionArchivo) ) {
      return res.status(400).json({
         ok: false,
         msg: 'No es una extension permitida'
      });
   }

   // Generar el nombre del archivo para que sea único (por si suben de diferente nombre y se almacene correctamente) Para eso se usa la extension UUID
   const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

   // Path para guardar la imagen
   const path = `./uploads/${ tipo }/${nombreArchivo}`;

   // Mover la imagen
   file.mv(path, (err) => { // MV es para mover el archivo, es de la libreria express-fileupload
      if (err) {
         return res.status(500).json({
            ok: false,
            msg: 'Error al mover la imagen'
         });
      }

      // Actualizar base de datos
    
      actualizarImagen(tipo, id, nombreArchivo);

      res.json({
         ok: true,
         msg: 'Archivo subido',
         nombreArchivo
      });
   
   });
   

};


const retornaImagen = (req, res = response) => {

   const tipo = req.params.tipo;
   const imagen = req.params.imagen;


   const pathImg = path.join( __dirname, `../uploads/${tipo}/${imagen}` );

   // Imagen por defecto
   if( fs.existsSync(pathImg) )  {
      res.sendFile( pathImg ); // Enviar el archivo
   } else {
      const pathImg = path.join(__dirname, '../assets/img/no-image-available.jpg');
      res.sendFile(pathImg);
   }



};

module.exports =  {
   fileUpload,
   retornaImagen
};