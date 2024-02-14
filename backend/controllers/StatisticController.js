const Receipt = require("../models/Receipt.js")

const mongoose = require("../db.js")
const express = require("express")
const router = express.Router()

const is_authorized = require("../middleware/is_authorized.js")

router.use(is_authorized)

function min_max_elements(arr) {
	let min_index = 0
	let max_index = 0
	for (let i = 1; i < arr.length; ++i) {
		if (arr[i] < arr[min_index]) {
			min_index = i
		}
		if (arr[i] > arr[max_index]) {
			max_index = i
		}
	}
	return [arr[min_index], arr[max_index]]
}

router.get(
	"/total_purchases",

	async function (req, res) {
		const pipeline = []
		const user_id = new mongoose.Types.ObjectId(req.body.user_id)

		pipeline.push({$match: {
			"user_id": user_id
		}})
		
		pipeline.push({$project: {
			"year": {$substrBytes: ["$date", 0, 4]},
			"month": {$substrBytes: ["$date", 5, 2]},
			"shop.name": true,
			"user_id": true
		}})

		const filters = {}
	
		const year = req.query.year
		if (year) {
			filters.year = year
		}
		
		const month = req.query.month
		if (month) {
			filters.month = month
		}

		pipeline.push({$match: filters})

		pipeline.push({$group: {
			"_id": "$shop.name",
			"total": {$sum: 1}
		}})

		pipeline.push({$sort: {
			"total": -1
		}})

		pipeline.push({$limit: 5})

		const data = await Receipt.aggregate(pipeline)
		res.json(data)
	}
)

router.get(
	"/money_spent",

	async function (req, res) {
		const pipeline = []
		const user_id = new mongoose.Types.ObjectId(req.body.user_id)
		
		pipeline.push({$match: {
			"user_id": user_id
		}})

		pipeline.push({
			$project: {
				"year": {$substrBytes: ["$date", 0, 4]},
				"month": {$toInt: {$substrBytes: ["$date", 5, 2]}},
				"total": true,
				"user_id": true
			}
		})
		
		const filters = {}
		
		const year = req.query.year
		if (year) {
			filters.year = year
		}
		
		pipeline.push({$match: filters})
		
		pipeline.push({$group: {
			"_id": "$month",
			"total": {$sum: "$total"}
		}})

		pipeline.push({$project: {
			"_id": true,
			"total": {$toString: "$total"}
		}})

		const data = await Receipt.aggregate(pipeline)
		res.json(data)
	}
)

router.get(
	"/product_price_history",

	async function (req, res) {
		const product_name = req.query["productName"] ? req.query["productName"] : ""
		const pipeline = [
			{$match: {"products.name": product_name}},
			{$unwind: "$products"},
			{$match: {"products.name": product_name}},
			{$project: {"_id": false, "date": true, "price": "$products.price"}},
			{$sort: {"date": 1}}
		]
		const data = await Receipt.aggregate(pipeline)
		res.json(data)
	}
)

router.get(
	"/products",

	async function (req, res) {
		const product_name = req.query["productName"] ? req.query["productName"] : ""
		const regexp = new RegExp(product_name)
		const user_id = new mongoose.Types.ObjectId(req.body.user_id)

		const pipeline = [
			{$match: {"user_id": user_id, "products.name": regexp}},
			{$unwind: "$products"},
			{$match: {"products.name": regexp}},
			{$group: {"_id": "$products.name"}},
			{$project: {"_id": 0, "productName": "$_id"}},
			{$sort: {"productName": 1}},
			{$limit: 7}
		]

		const data = await Receipt.aggregate(pipeline)
		res.json(data.map(element => element.productName))
	}
)

router.get(
	"/purchases_years",

	async function (req, res) {
		const id = new mongoose.Types.ObjectId(req.body.user_id)
		const aggregation_pipeline = [
			{$match: {"user_id": id}},
			{$project: {"_id": 0, "year": {$substrBytes: ["$date", 0, 4]}}},
			{$group: {"_id": "$year"}},
		]
		const data = await Receipt.aggregate(aggregation_pipeline)
		res.json(min_max_elements(data.map(element => element._id)))
	}
)

module.exports = router