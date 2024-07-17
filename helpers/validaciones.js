const validateFields = (schema, toCompare, response) => {
    try {

        const validate = schema.validate(toCompare);

        if (validate.error) {
            response.code = 404;
            response.message = "Faltan campos por llenar";
            response.error = "Faltan campos por llenar";
            return true;
        }
    } catch (error) {
        response.code = 404;
        response.message = "Fallo al intentar validar las variables en el servicio OTP"
        return true;
    }
    return false;
}

module.exports = {
    validateFields
}