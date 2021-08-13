/** @format */

const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// protecting authenticated routes using jwt token
const authCheck = (req, res, next) => {
	const token = req.cookies.jwt;

	// if jwt exists & is verified
	if (token) {
		/* 
      this verifies the existing token with the regenerated token 
      with the help of secret_key, to see if the current token is a valid one */
		jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect("/login");
			} else {
				console.log(decodedToken);
				next();
			}
		});
	} else {
		res.redirect("/login");
	}
};

const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				next();
			} else {
				let user = await User.findById(decodedToken.id);
				res.locals.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};

module.exports = { authCheck, checkUser };
