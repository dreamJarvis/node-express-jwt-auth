/** @format */

const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Please enter an a Email"],
		unique: true,
		lowercase: true,
		validate: [isEmail, "Please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: [6, "password must be atleast 6 characters long"],
	},
});

//** fire a function after doc saved to db **//
// userSchema.post("save", function (doc, next) {
// 	console.log("new user was created & saved", doc);
// 	next();
// });

//** fire a f^n before doc saved to db **//
userSchema.pre("save", async function (next) {
	// hashing passwords //
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// static method to login user with password
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error("Incorrect password");
	}
	throw Error("Incorrect email");
};

module.exports = mongoose.model("user", userSchema);
