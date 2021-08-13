/** @format */

const jwt = require("jsonwebtoken");

const createJWTAuthToken = (id, maxAge) => {
	return jwt.sign({ id }, process.env.SECRET_KEY, {
		expiresIn: maxAge,
	});
};

module.exports = { createJWTAuthToken };
