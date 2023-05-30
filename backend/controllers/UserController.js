const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User.js")
const router = express.Router()

router.post(
	"/login",

	async function(req, res) {
		const username = req.body.username
		const password = req.body.password

		if (username === undefined || password === undefined) {
			res.status(400).send({message: "No password or username provided"})
			return
		}

		const user = await User.findOne({name: username})

		if (user === null) {
			res.status(400).send({message: "Incorrect username"})
			return
		}

		if (!await bcrypt.compare(password, user.password)) {
			res.status(401).send({message: "Incorrect password"})
			return
		}

		res.status(200).json({message: "Logged in successfully", token: user.generateAuthToken(), user_id: user._id})
	}
)

router.post(
	"/register",

	async function(req, res) {
		const username = req.body.username
		const password = req.body.password
		
		if (username === undefined || password === undefined) {
			res.status(400).send({message: "No password or username provided"})
			return
		}

		//todo: wymogi dotyczące hasła

		const user = await User.findOne({name: username})

		if (user !== null) {
			console.log(user)
			res.status(409).json({message: "User with provided username already exists"})
			return
		}
	
		const salt_rounds = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
		const hashed_password = await bcrypt.hash(password, salt_rounds)

		const new_user = new User({name: username, password:  hashed_password})
		await new_user.save()

		res.status(201).json({message: "User created successfully"})
	}
)

module.exports = router