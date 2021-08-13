/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./Routes/authRoutes");
const { authCheck, checkUser } = require("./middlewares/authMiddleware");

require("dotenv").config();

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then((result) => app.listen(5000))
	.catch((err) => console.log(err));

// routes
app.get("*", checkUser); // applying middleware globally on every single GET request
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", authCheck, (req, res) => res.render("smoothies"));
app.use(authRoutes);
