const jwt = require("jsonwebtoken");
const { searchUserR } = require("../repository/repository.user");
const verifyTokenS = async (token) => {
	if (token) {
		try {
			const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			return verified;
		} catch (error) {
			return false;
		}
	} else {
		return false;
	}
};

const authS = async (token) => {
	let response = {
		code: 404,
		message: "",
		data: {},
		token: ""
	}
	const isValid = await verifyTokenS(token);
	try {
		if (isValid) {
			const decoded = jwt.decode(token)
			const acsTkn = await generateAccessTokenS(decoded.usuario)
			response.code = 200;
			response.message = "Autorizado";
			response.data=decoded;
			response.token = acsTkn;
		}
	} catch (error) {
		response.code = 401
		response.message = "Ha ocurrido un error inesperado"
	}
	return response;
};

const decode = async (token) => {
	return jwt.decode(token)
}

const generateAccessTokenS = async (usuario) => {
	const userT = await searchUserR(usuario);
	if (userT.administrador == true) {
		const accessToken = await jwt.sign(
			{ "usuario": usuario, "administrador": true },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1h' })
		return accessToken
	} else {
		const accessToken = await jwt.sign(
			{ "usuario": usuario, "administrador": false },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1h' })
		return accessToken
	}
};

const generateRefreshTokenS = async (usuario) => {
	const refreshToken = await jwt.sign(
		{ "usuario": usuario },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '1h' })
	return refreshToken
};

const generateRecuperarContrasena = async (codigo) => {
	const refreshToken = jwt.sign(
		{ "codigo": codigo },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '1h' })
	return refreshToken
};
module.exports = { authS, generateAccessTokenS, generateRefreshTokenS, verifyTokenS, decode, generateRecuperarContrasena };