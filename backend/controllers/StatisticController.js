const Receipt = require("../models/Receipt.js")

const mongoose = require("../db.js")
const express = require("express")
const router = express.Router()

const is_authorized = require("../middleware/is_authorized.js")

router.use(is_authorized)

router.get(
	"/total_purchases",

	async function (req, res) {
		const id = new mongoose.Types.ObjectId(req.body.user_id)
		const data = await Receipt.aggregate([{$match: {user_id: id}}, {$group: {_id: "$shop.name", "total": {$sum: 1}}}, {$sort: {"total": -1}}])
		res.json(data)
	}
)

router.get(
	"/money_spent",

	async function (req, res) {
		const id = new mongoose.Types.ObjectId(req.body.user_id)
		const data = await Receipt.aggregate([{$group: {"_id": {$substrBytes: ["$datetime", 5, 2]}, "total": {$sum: "$total"}}}])
		res.json(data)
	}
)

module.exports = router