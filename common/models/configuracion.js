'use strict';

module.exports = function(Configuracion) {
    Configuracion.getUltimoFolio = function(cb) {
        Configuracion.findOne(function(err, configuracion) { 
            cb(null, configuracion.ultimoFolio);
        });    
    };
      
    Configuracion.remoteMethod('getUltimoFolio', {
        http: {
            verb: "GET"
        },
        returns: {
            arg: 'ultimoFolio',
            type: 'object'
        }
    });
};
