const Receipt = require("../models/Receipt.js")

const express = require("express")
const router = express.Router()

const is_authorized = require("../middleware/is_authorized.js")

router.use(is_authorized)

router.post(
	"/",
	
	async function(req, res) {
		try {
			const receipt = new Receipt(req.body)
			await receipt.save()
			res.json(receipt)
		}
		catch (error) {
			console.log(error)
			res.status(400).json({message: "Bad request"})
		}
	}
)

router.put(
	"/",

	async function(req, res) {
		console.log(req.body)
		const receipt = await Receipt.findByIdAndUpdate(req.body._id, req.body) 
		res.json(receipt)
	}
)

router.get(
	"/",

	async function(req, res) {	
		const filter = req.query
		filter.user_id = req.body.user_id
		console.log(filter)

		const docs = await Receipt.find(filter)
		res.json(docs)
	}
)

router.get(
	"/:id",

	async function(req, res) {
		const doc = await Receipt.findById(req.params.id)
		res.json(doc)
	}
)

router.delete(
	"/",

	async function(req, res) {
		try {
			const result = await Receipt.findByIdAndDelete(req.body.receipt_id)
			res.json(result)
		}
		catch (error) {
			if (error.name === "CastError") {
				return res.status(400).json({message: "Invalid id"})
			}
			
			console.log(error)
			return res.status(500).json({message: "Internal server error :3"})
		}
	}
)

module.exports = router
