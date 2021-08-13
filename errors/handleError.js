/** @format */

const handleErrors = (err) => {
	// console.log(err.message, err.code);

	let errors = { email: "", password: "" };

	// incorrect email
	if (err.message === "Incorrect email") {
		errors.email = "email is not registered!";
	}

	// incorrect password
	if (err.message === "Incorrect password") {
		errors.password = "incorrect password entered!";
	}

	// duplicate errors code
	if (err.code === 11000) {
		errors.email = "This email already exists !";
		return errors;
	}

	// validation errors
	if (err.message.includes("user validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

module.exports = { handleErrors };
