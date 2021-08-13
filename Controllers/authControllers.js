/** @format */

const User = require("../Models/User");
const { handleErrors } = require("../errors/handleError");
const { createJWTAuthToken } = require("./createAuthToken");

const maxAge = 3 * 24 * 60 * 60; // 3 days seesion period

module.exports.signup_get = (req, res) => {
	res.render("signup");
};

module.exports.login_get = (req, res) => {
	res.render("login");
};

// sign up with jwt authentication
module.exports.signup_post = async (req, res) => {
	try {
		const { email, password } = req.body;

		// create a user
		const user = await User.create({ email, password });

		// authenticating with JWT //
		const token = createJWTAuthToken(user._id, maxAge);

		// setting up cookie with jwt token
		res.cookie("jwt", token, {
			httpOnly: true,
			maxAge: maxAge * 1000,
		});

		return res.status(201).json({ user: user._id });
	} catch (error) {
		const err = handleErrors(error);
		return res.status(400).json({ success: false, errors: err });
	}
};

// logging in with jwt authentication
module.exports.login_post = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.login(email, password);

		// creating a jwt token cookie, for user authentication
		const token = createJWTAuthToken(user._id, maxAge);
		res.cookie("jwt", token, {
			httpOnly: true,
			maxAge: maxAge * 1000,
		});

		return res.status(200).json({ user: user._id });
	} catch (error) {
		const err = handleErrors(error);
		return res.status(400).json({ success: false, errors: err });
	}
};

// logging out
module.exports.logout_get = (req, res) => {
	res.cookie("jwt", "", {
		maxAge: 1,
	});
	res.redirect("/");
};
