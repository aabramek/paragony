const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User.js")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")
const router = express.Router()

router.post(
	"/login",

	async function(req, res) {
		const username = req.body.username
		const password = req.body.password

		if (username === undefined || password === undefined) {
			return res.status(400).send({message: "No password or username provided"})
		}

		const user = await User.findOne({name: username})

		if (user === null) {
			return res.status(400).send({message: "Incorrect username"})
		}

		if (!await bcrypt.compare(password, user.password)) {
			return res.status(401).send({message: "Incorrect password"})
		}

		res.status(200).json({message: "Logged in successfully", token: user.generateAuthToken(), user_id: user._id})
	}
)

router.post(
	"/register",

	async function(req, res) {
		const username = req.body.username
		const password = req.body.password

		const user = await User.findOne({name: username})

		if (user !== null) {
			res.status(409).json({message: "User with provided username already exists"})
			return
		}
	
		const user_schema = Joi.object({
			username: Joi.string().min(4).max(20).required().label("username"),
			password: passwordComplexity().required().label("password")
		})

		const {error} = user_schema.validate({username: username, password: password})

		if (error) {
			return res.status(400).json({message: error.details.reduce((acc, cv) => cv.message + "\n", "")})
		}

		const salt_rounds = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
		const hashed_password = await bcrypt.hash(password, salt_rounds)

		const new_user = new User({name: username, password: hashed_password})
		await new_user.save()

		res.status(201).json({message: "User created successfully"})
	}
)

module.exports = router