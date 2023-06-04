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
		const aggregation_pipeline = []
		aggregation_pipeline.push({
			$project: {
				"year": {$substrBytes: ["$datetime", 0, 4]},
				"month": {$substrBytes: ["$datetime", 5, 2]},
				"shop.name": 1,
				"user_id": 1
			}
		})
		const match_stage_filters = {
			user_id: id
		}
		
		const year = req.query.year
		if (year !== "") {
			match_stage_filters.year = year
		}
		
		const month = req.query.month
		if (month !== "") {
			match_stage_filters.month = month
		}
		
		aggregation_pipeline.push({$match: match_stage_filters})
		aggregation_pipeline.push({$group: {_id: "$shop.name", "total": {$sum: 1}}})
		aggregation_pipeline.push({$sort: {"total": -1}})

		const data = await Receipt.aggregate(aggregation_pipeline)
		res.json(data)
	}
)

router.get(
	"/money_spent",

	async function (req, res) {
		const id = new mongoose.Types.ObjectId(req.body.user_id)
		const aggregation_pipeline = []
		aggregation_pipeline.push({
			$project: {
				"year": {$substrBytes: ["$datetime", 0, 4]},
				"month": {$toInt: {$substrBytes: ["$datetime", 5, 2]}},
				"total": 1
			}
		})
		
		const year = req.query.year
		if (year !== "") {
			aggregation_pipeline.push({$match: {"year": year}})
		}
		
		aggregation_pipeline.push({$group: {"_id": "$month", "total": {$sum: "$total"}}})
		aggregation_pipeline.push({$sort: {"_id": 1}})
		
		const data = await Receipt.aggregate(aggregation_pipeline)
		res.json(data)
	}
)

module.exports = router