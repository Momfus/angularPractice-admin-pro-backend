
const { Schema, model } = require('mongoose');

// Definir modelo
const HospitalSchema = Schema({

   nombre: {

     type: String,
     required: true 

   },
   img: {

      type: String

   },
   usuario: {

      type: Schema.Types.ObjectId,
      ref: 'Usuario'

   }

}, { collection: 'hospitales'}); // Por defecto, moongose le agrega la "s" en plural pero para casos que queramos personalizado, se define de estamanera

// Sobreescribir como devuelve algunos atributos
HospitalSchema.method('toJSON', function(){

   const{ __v, ...object } = this.toObject(); // Obtener la instancia actual y extraigo los atributos a cambiar (...object es obtener el restro de los atributos definidos)
   return object;

} );


// Exportarlo para usarse
module.exports = model('Hospital', HospitalSchema); 