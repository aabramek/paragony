const jwt = require("jsonwebtoken")

function is_authorized(req, res, next) {
	const authHeader = req.headers["authorization"]
	if (authHeader === undefined) {
		res.status(401).json({message: "No authrozation provided"})
	}
	const token = authHeader.slice(7)
	try {
		const payload = jwt.verify(token, process.env.JWT_SECURE_KEY, {algorithms: [process.env.JWT_ALGO]})
	}
	catch(error) {
		res.status(401).send("")
		return
	}
	next()
}

module.exports = is_authorized