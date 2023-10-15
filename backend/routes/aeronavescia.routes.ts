const AeronavesCiaRoutes = require('express').Router();

// const user = require('../controllers/user.controller');

AeronavesCiaRoutes.get("/aeronavecia", aeronave.findAll);

AeronavesCiaRoutes.put("/aeronavecia", validarToken, aeronave.validaToken);

AeronavesCiaRoutes.delete("/aeronavecia/:id", aeronave.findOne);