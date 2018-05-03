'use strict';

module.exports = function(Usuario) {
/*     var app = require('../../server/server');
    var Configuracion = app.models.Configuracion; */

    Usuario.login = function(data, cb) {
        Usuario.findOne({where: {usuario: data.usuario, password: data.password}}, function(err, usuario) { 
            cb(null, usuario);
        });    
    };
      
    Usuario.remoteMethod('login', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'usuario',
            type: 'object'
        }
    });
};
