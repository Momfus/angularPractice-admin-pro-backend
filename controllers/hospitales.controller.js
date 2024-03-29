
const { response } = require('express');

const Hospital = require('../models/hospital.model');

const getHospitales = async(req, res = response) => {

   const desde = Number(req.query.desde) || 0; // Caso que no se mande el valor o no sea un número, se envia un 0
   const limite = Number(req.query.limite) || 0;

   const [hospitales, total] = await Promise.all([

      Hospital
         .find({}, 'nombre img usuario')
         .skip( desde )
         .limit( limite ),

      Hospital.countDocuments()

   ]);
   res.json({
      ok: true,
      total,
      hospitales
   });

};

const crearHospital = async(req, res = response) => {

   const uid = req.uid;
   const hospital = new Hospital({
      usuario: uid,
      ...req.body
   });

   try {
   
      const hospitalDB = await hospital.save();

      res.json({
         ok: true,
         hospital: hospitalDB
      });
      
   } catch (error) {
      
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador'
      });
      
   }
   
};


const actualizarHospital = async(req, res = response) => {

   const id = req.params.id;
   const uid = req.params.uid;

   try {

      const hospitalDB = await Hospital.findById( id );

      // En caso que no exista en el DB
      if( !hospitalDB ) {
         return res.status(404).json({
            ok: true,
            msg: 'Hospital no encontrado',
         });
      }

      // Actualizar hospital
      const cambiosHospital = { // obtengo directamente todos los datos del hospital y que el usuario tenga del que esta actualizando
         ...req.body,
         usuario: uid
      };

      const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true }); // El último parámetro regresa el último documento ya actualizado

      res.json({
         ok: true,
         hospital: hospitalActualizado
      });

   } catch(error) {

      console.log(error);

      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador'
      });

   }
};

const borrarHospital = async (req, res = response) => {


   const id = req.params.id;

   try {

      const hospitalDB = await Hospital.findById( id );

      // En caso que no exista en el DB
      if( !hospitalDB ) {
         return res.status(404).json({
            ok: true,
            msg: 'Hospita no encontrado',
         });
      }

      // Borrar hospital de la DB
      await Hospital.findByIdAndDelete(id);

      res.json({
         ok: true,
         msg: 'Hospital eliminado'
      });

   } catch(error) {

      console.log(error);

      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador'
      });

   }
   
};

module.exports = {
   getHospitales,
   crearHospital,
   actualizarHospital,
   borrarHospital
};