'use strict';

module.exports = function(Articulo) {
    Articulo.searchByName = function(texto, cb) {
        Articulo.find({where:  {'descripcion': new RegExp( '.*' + texto +'.*', 'i')}}, function(err, articulos) { 
            cb(null, articulos);
        });    
    };
      
    Articulo.remoteMethod('searchByName', {
        accepts: {
            arg: 'texto',
            type: 'string'
        },
        returns: {
            arg: 'articulos',
            type: 'object'
        }
    });

    Articulo.registrar = function(articulo, cb) {
        //Obtiene los modelos necesarios
        var app = require('../../server/server');
        var Configuracion = app.models.Configuracion;

        Articulo.create(articulo, function(err, articuloResultado) {
            //Se actualiza la última clave registrada en la configuración
            Configuracion.findOne( function(err, configuracionResultado) {
                //Nueva clave
                configuracionResultado.ultimoArticulo = configuracionResultado.ultimoArticulo + 1;
                //Se actualiza la configuración en la BD
                configuracionResultado.save();
            });

            cb(null, articuloResultado);
        });    
    };
      
    Articulo.remoteMethod('registrar', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'articulo',
            type: 'object'
        }
    });

    Articulo.editar = function(articulo, cb) {
        //Se busca el articulo a editar
        Articulo.findOne({where: {'id': articulo.id}}, function(err, articuloResultado) {
            //Se asigna la nueva información
            articuloResultado.descripcion = articulo.descripcion;
            articuloResultado.modelo = articulo.modelo;
            articuloResultado.precio = articulo.precio;
            articuloResultado.existencia = articulo.existencia;

            //Se actualiza la configuración en la BD
            articuloResultado.save();

            cb(null, articuloResultado);
        });
    };
      
    Articulo.remoteMethod('editar', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'articulo',
            type: 'object'
        }
    });
};
