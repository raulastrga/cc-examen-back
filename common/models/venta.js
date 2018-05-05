'use strict';

module.exports = function(Venta) {

    Venta.registrar = function(data, cb) {

        //Obtiene los modelos necesarios
        var app = require('../../server/server');
        var DetalleVenta = app.models.DetalleVenta;
        var Articulo = app.models.Articulo;
        var Configuracion = app.models.Configuracion;

        //Asgina la información del objeto de la venta
        var venta = {
            folio: data.folio,
            claveCliente: data.claveCliente,
            nombreCliente: data.nombreCliente,
            total: data.totalPagar,
            fecha: new Date(),
            plazo: data.plazo,
            precioContado: data.precioContado,
            importeAbono: data.importeAbono,
            importeAhorra: data.importeAhorra,
            estatus: "1"
        }

        //Registra en la BD el objeto de la venta
        Venta.create(venta, function(err, ventaResultado) { 
            //Asigna la información de cada articulo vendido
            var detalleVenta = [];
            data.detalleVenta.forEach(function (item) {
                var elemento = {
                    idVenta: ventaResultado.id,
                    folioVenta: data.folio,
                    idArticulo: item.id,
                    claveArticulo: item.clave,
                    descripcion: item.descripcion,
                    modelo: item.modelo,
                    cantidad: item.cantidad,
                    precio: item.precio,
                    importe: item.importe
                }

                //Registra el articulo vendido en la BD
                DetalleVenta.create(elemento, function(err, detalleVentaResultado) {
                    if(!err) {
                        //Se busca el articulo
                        Articulo.findOne({where: {'id': detalleVentaResultado.idArticulo}}, function(err, articuloResultado) {
                            //Nueva existencia
                            articuloResultado.existencia = articuloResultado.existencia - detalleVentaResultado.cantidad;
                            //Se actualiza el articulo con la nueva existencia
                            articuloResultado.save();
                        });
                    }
                });
            });

            //Se actualiza el último folio registrado en la configuración
            Configuracion.findOne( function(err, configuracionResultado) {
                //Nuevo folio
                configuracionResultado.ultimoFolio = configuracionResultado.ultimoFolio + 1;
                //Se actualiza la configuración en la BD
                configuracionResultado.save();
            });

            //Regresa el resultado de la venta
            cb(null, ventaResultado);
        });
    };
      
    Venta.remoteMethod('registrar', {
        accepts: {
            arg: 'data',
            type: 'object',
            http: { source: 'body' }
        },
        returns: {
            arg: 'resultado',
            type: 'object'
        }
    });
};
