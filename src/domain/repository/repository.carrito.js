const db = require("../model/index.js");

const buscarCarritoR = async (usuario) => {
    try {
        let prendas = [];
        const carrito_id = await db.carritos.findOne({
            where: {
                usuario: usuario,
            }
        });

        const carrito = await db.carrito_prendas.findAll({
            where: {
                id_carrito : carrito_id.id
            }
        })

        for (let index = 0; index < carrito.length; index++) {
            let prenda = {}
            prenda = await db.prendas.findOne({
                where:{id: carrito[index].dataValues.id_prenda}
                
            })
            const id_prenda_carrito = carrito[index].dataValues.id_prenda_carrito
            const talla = carrito[index].dataValues.talla
            const cantidad = carrito[index].dataValues.cantidad
            prendas.push({...prenda.dataValues, id_prenda_carrito, talla, cantidad})
        }
        
        return { carrito_id: carrito_id.id, prendas}
    } catch (error) {
        return { error: error }
    }
}

const agregarPrendaR = async (usuario, id_prenda, id_prenda_carrito, talla, cantidad) => {
    const date = new Date();
    try {
        let id;
        const carrito_id = await db.carritos.findOne({
            where: {
                usuario: usuario,
            }
        });
        
        if(!carrito_id){
        const carrito = await db.carritos.create(
            {
                usuario: usuario,
                estado_carrito: "creado",
                fecha_solicitud: date.getTime(),
                fecha_actualizacion: date.getTime()
            });
            id=carrito.id
        }else{
            id=carrito_id.id
        }

        const carrito_prendas = await db.carrito_prendas.create(
            {
                id_carrito: id,
                id_prenda: id_prenda,
                id_prenda_carrito: id_prenda_carrito,
                talla : talla,
                cantidad: cantidad
            });

        if (carrito_prendas) {
            return {
                id_prenda,
                id_prenda_carrito,
                id_carrito: id,
                talla,
                cantidad
            }
        } else {
            return false
        }
    } catch (error) {
        return false;
    }
}

const quitarPrendaR = async (usuario, id_prenda_carrito) => {
    try {
        const carrito_id = await db.carritos.findOne({
            where: {
                usuario: usuario,
            }
        });
        return await db.carrito_prendas.destroy({
            where: {
                id_carrito : carrito_id.id,
                id_prenda_carrito : id_prenda_carrito
            }
        });
    } catch (error) {
        return false;
    }
}

module.exports = { buscarCarritoR, agregarPrendaR, quitarPrendaR  }
