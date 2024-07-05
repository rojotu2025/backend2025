const { listarPrendasR, listarPrendasFrontR, buscarPrendasOutfitR } = require('../repository/repository.prendas.js');
const { authS } = require('./service.auth.js');

const listarPrendasS = async (token, sexo, rol, clima, grupo, pais) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }
    const isValid = authS(token);
    if ((await isValid).code == 200) {
        const usuario = await isValid;
        let prendas = await listarPrendasR(sexo, rol, clima, grupo, pais);
        if (prendas) {
            let superiores = [];
            let inferiores = [];
            let otros = [];
            for (let p = 0; p < prendas.length; p++) {
                if(prendas[p].tallas.includes('LONG')){
                    const search = 'LONG'
                    const replacer = new RegExp(search, 'g')
                    prendas[p].tallas=prendas[p].tallas.replace(replacer,"L")
                }
                switch (prendas[p].segmento_Prenda) {
                    case 'INFERIOR':
                        inferiores.push(prendas[p]);
                        break;

                    case 'SUPERIOR':
                        superiores.push(prendas[p]);
                        break;

                    default:
                        otros.push(prendas[p]);
                        break;
                }
            }

            const newPrendas = {
                superiores: superiores,
                inferiores: inferiores,
                otros: otros
            }

            response.code = 200;
            response.message = "autorizado";
            response.data = newPrendas;
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}

const listarPrendasFrontS = async (token, sexo, rol, clima, grupo, pais) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }
    const isValid = authS(token);
    if ((await isValid).code == 200) {
        const usuario = await isValid;
        const prendas = await listarPrendasFrontR(sexo, rol, clima, grupo, pais);
        if (prendas) {
            response.code = 200;
            response.message = "autorizado";
            response.data = prendas;
            response.token = usuario.token;
        }
    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}

const buscarPrendasOutfitS = async (token, ref_superior, ref_inferior, ref_chaqueta) => {
    let response = {
        code: "",
        message: "",
        data: ""
    }

    const isValid = authS(token);
    if ((await isValid).code == 200) {
        const usuario = await isValid;
        const inferior = await buscarPrendasOutfitR(ref_superior);
        const superior = await buscarPrendasOutfitR(ref_inferior);
        const otro = await buscarPrendasOutfitR(ref_chaqueta);
        let obj = {}
        if (inferior) {
            let prenda_inferior = {}
            prenda_inferior = {
                id: inferior.id,
                referencia: inferior.referencia,
                nombre_prenda: inferior.nombre_prenda,
                descripcion: inferior.descripcion,
                proveedor: inferior.proveedor,
                nombre_archivo:inferior.nombre_archivo,
                tipo: inferior.tipo,
                clima: inferior.clima,
                segmento_Prenda: inferior.segmento_Prenda,
                genero: inferior.genero,
                tallas: inferior.tallas,
                rol: inferior.rol,
                pais: inferior.pais,
                grupo: inferior.grupo
            }
            obj = {
                prenda_inferior,
                ...obj
            }
        }

        if (superior) {
            let prenda_superior = {}
            prenda_superior = {
                id: superior.id,
                referencia: superior.referencia,
                nombre_prenda: superior.nombre_prenda,
                descripcion: superior.descripcion,
                proveedor: superior.proveedor,
                nombre_archivo:superior.nombre_archivo,
                tipo: superior.tipo,
                clima: superior.clima,
                segmento_Prenda: superior.segmento_Prenda,
                genero: superior.genero,
                tallas: superior.tallas,
                rol: superior.rol,
                pais: superior.pais,
                grupo: superior.grupo
                
            }
            obj = {
                prenda_superior,
                ...obj
            }
        }

        if (otro) {
            let prenda_otro = {}
            prenda_otro = {
                id: otro.id,
                referencia: otro.referencia,
                nombre_prenda: otro.nombre_prenda,
                descripcion: otro.descripcion,
                proveedor: otro.proveedor,
                nombre_archivo:otro.nombre_archivo,
                tipo: otro.tipo,
                clima: otro.clima,
                segmento_Prenda: otro.segmento_Prenda,
                genero: otro.genero,
                tallas: otro.tallas,
                rol: otro.rol,
                pais: otro.pais,
                grupo: otro.grupo
            }
            obj = {
                prenda_otro,
                ...obj
            }
        }

        response.code = 200;
        response.message = "autorizado";
        response.data = obj;
        response.token = usuario.token;

    } else {
        response.code = 401
        response.message = "No autorizado o sesion expirada"
    }

    return response
}

module.exports = { listarPrendasS, listarPrendasFrontS, buscarPrendasOutfitS }