const { Router } = require('express');

const controleDonos = require('./controladores/donos');
const controlePets = require("./controladores/pets");
const seguranca = require('./controladores/seguranca');

const rotas = new Router();

rotas.route("/login")
     .post(seguranca.login)

rotas.route('/pets')
   .get(seguranca.verificaJWT, controlePets.getPets)
   .post(seguranca.verificaJWT, controlePets.addPet)
   .put(seguranca.verificaJWT, controlePets.updatePet)

rotas.route('/pets/:codigo')
   .get(seguranca.verificaJWT, controlePets.getPetPorCodigo)
   .delete(seguranca.verificaJWT, controlePets.deletePet)


rotas.route('/donos')
     .get(seguranca.verificaJWT, controleDonos.getDonos)
     .post(seguranca.verificaJWT, controleDonos.addDono)
     .put(seguranca.verificaJWT, controleDonos.updateDono)

rotas.route('/donos/:codigo')
     .get(seguranca.verificaJWT, controleDonos.getDonoPorCodigo)
     .delete(seguranca.verificaJWT, controleDonos.deleteDono)

module.exports = rotas;