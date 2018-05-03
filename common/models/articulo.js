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
};
