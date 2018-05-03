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
};
