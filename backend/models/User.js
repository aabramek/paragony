const jwt = require("jsonwebtoken")

const mongoose = require("../db.js")

const userSchema = new mongoose.Schema({
	name: String,
	password: String
})

userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign({_id: this._id, name: this.name}, process.env.JWT_SECURE_KEY, {expiresIn: process.env.JWT_EXPIRE_TIME, algorithm: process.env.JWT_ALGO})
	return token
}

const User = mongoose.model("User", userSchema)

module.exports = User