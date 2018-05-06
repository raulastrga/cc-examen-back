'use strict';

module.exports = function(Configuracion) {
    Configuracion.getUltimaClaveCliente = function(cb) {
        Configuracion.findOne(function(err, configuracion) {
            //Valida si el resultado es nulo (no existe configuración registrada)
            var resultado = configuracion === null ? configuracion : configuracion.ultimoCliente
            cb(null, resultado);
        });    
    };
      
    Configuracion.remoteMethod('getUltimaClaveCliente', {
        http: {
            verb: "GET"
        },
        returns: {
            arg: 'ultimoCliente',
            type: 'object'
        }
    });

    Configuracion.getUltimaClaveArticulo = function(cb) {
        Configuracion.findOne(function(err, configuracion) { 
            //Valida si el resultado es nulo (no existe configuración registrada)
            var resultado = configuracion === null ? configuracion : configuracion.ultimoArticulo
            cb(null, resultado);
        });    
    };
      
    Configuracion.remoteMethod('getUltimaClaveArticulo', {
        http: {
            verb: "GET"
        },
        returns: {
            arg: 'ultimoArticulo',
            type: 'object'
        }
    });

    Configuracion.registrar = function(configuracion, cb) {
        //Se busca la configuración a editar
        Configuracion.findOne({where: {'id': configuracion.id}}, function(err, configuracionResultado) {
            //Si ya existe la configuración entonces actualiza
            if (configuracionResultado !== null) {
                //Se asigna la nueva información
                configuracionResultado.tasaFinanciamiento = configuracion.tasaFinanciamiento;
                configuracionResultado.porcentajeEnganche = configuracion.porcentajeEnganche;
                configuracionResultado.plazoMaximo = configuracion.plazoMaximo;

                //Se actualiza la configuración en la BD
                configuracionResultado.save();

                cb(null, configuracionResultado);
            } else {
                //Sino existe entonces la crea
                configuracion.ultimoFolio = 0;
                configuracion.ultimoCliente = 0;
                configuracion.ultimoArticulo = 0;

                Configuracion.create(configuracion, function(err, configuracionResultado) {
                    cb(null, configuracionResultado);
                });
            }
        });
    };
      
    Configuracion.remoteMethod('registrar', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'configuracion',
            type: 'object'
        }
    });
};
