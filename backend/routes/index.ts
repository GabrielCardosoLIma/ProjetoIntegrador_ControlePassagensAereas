const rout = require('express').Router();

const aeronavesciaRoutes = require('./aeronavescia.routes');
rout.use('/aeronavescia', aeronavesciaRoutes);

module.exports = rout;