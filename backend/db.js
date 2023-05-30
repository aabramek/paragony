const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
	.then(function(result) {
		console.log("Connection to database established")
	})
	.catch(function(error) {
		console.log(error)
	})

module.exports = mongoose