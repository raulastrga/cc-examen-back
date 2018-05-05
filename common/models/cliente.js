'use strict';

module.exports = function(Cliente) {
    Cliente.searchByName = function(texto, cb) {
        var query = {
            $or: [
                {'nombre': new RegExp( '.*' + texto +'.*', 'i')},
                {'apellidoPaterno' : new RegExp( '.*' + texto +'.*', 'i')},
                {'apellidoMaterno' : new RegExp( '.*' + texto +'.*', 'i')}
            ]
        };

        Cliente.find({where: query}, function(err, clientes) { 
            cb(null, clientes);
        });    
    };
      
    Cliente.remoteMethod('searchByName', {
        accepts: {
            arg: 'texto',
            type: 'string'
        },
        returns: {
            arg: 'clientes',
            type: 'object'
        }
    });

    Cliente.registrar = function(cliente, cb) {
        //Obtiene los modelos necesarios
        var app = require('../../server/server');
        var Configuracion = app.models.Configuracion;

        Cliente.create(cliente, function(err, clienteResultado) {
            //Se actualiza la última clave registrada en la configuración
            Configuracion.findOne( function(err, configuracionResultado) {
                //Nueva clave
                configuracionResultado.ultimoCliente = configuracionResultado.ultimoCliente + 1;
                //Se actualiza la configuración en la BD
                configuracionResultado.save();
            });

            cb(null, clienteResultado);
        });    
    };
      
    Cliente.remoteMethod('registrar', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'cliente',
            type: 'object'
        }
    });

    Cliente.editar = function(cliente, cb) {
        //Se busca el cliente a editar
        Cliente.findOne({where: {'id': cliente.id}}, function(err, clienteResultado) {
            //Se asigna la nueva información
            clienteResultado.nombre = cliente.nombre;
            clienteResultado.apellidoPaterno = cliente.apellidoPaterno;
            clienteResultado.apellidoMaterno = cliente.apellidoMaterno;
            clienteResultado.rfc = cliente.rfc;

            //Se actualiza la configuración en la BD
            clienteResultado.save();

            cb(null, clienteResultado);
        });
    };
      
    Cliente.remoteMethod('editar', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'cliente',
            type: 'object'
        }
    });
};
