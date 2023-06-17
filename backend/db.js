const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, user: process.env.MONGO_USER, pass: process.env.MONGO_PASSWORD})
	.then(function(result) {
		console.log("Connection to database established")
	})
	.catch(function(error) {
		console.log(error)
	})

module.exports = mongoose