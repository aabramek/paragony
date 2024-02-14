const Receipt = require("../models/Receipt.js")
const express = require("express")
const mongoose = require("../db.js")
const router = express.Router()

const is_authorized = require("../middleware/is_authorized.js")

router.use(is_authorized)

router.post(
	"/",
	
	async function(req, res) {
		const receipt = new Receipt(req.body)
		try {
			await receipt.save()
		}
		catch (error) {
			msg = ""
			for (field in error.errors) {
				msg += error.errors[field].message + "\n"
			}
			return res.status(400).json({message: msg})
		}
		res.status(201).json(receipt)
	}
)

router.put(
	"/",

	async function(req, res) {
		const receipt = await Receipt.findByIdAndUpdate(req.body._id, req.body) 
		res.json(receipt)
	}
)

router.get(
	"/",

	async function(req, res) {	
		const filter = {
			user_id: new mongoose.Types.ObjectId(req.body.user_id)
		}

		const useRegex = req.query["useRegex"] === "true" 
		if (req.query["shop.name"] !== undefined) {
			filter["shop.name"] = useRegex ? new RegExp(req.query["shop.name"]) : req.query["shop.name"]
		}

		if (req.query["shop.city"] !== undefined) {
			filter["shop.city"] = useRegex ? new RegExp(req.query["shop.city"]) : req.query["shop.city"]
		}

		if (req.query["shop.street"] !== undefined) {
			filter["shop.street"] = useRegex ? new RegExp(req.query["shop.street"]) : req.query["shop.street"]
		}

		const date_filter = []
		if (req.query.timeAndDateMutuality === "true") {
			if (req.query["dateFrom"] !== undefined && req.query["timeFrom"] !== undefined) {
				date_filter.push({$or: [{date: {$gt: req.query["dateFrom"]}}, {$and: [{date: req.query["dateFrom"]}, {time: {$gte: req.query["timeFrom"]}}]}]})
			}
			if (req.query["dateTo"] !== undefined && req.query["timeTo"] !== undefined) {
				date_filter.push({$or: [{date: {$lt: req.query["dateTo"]}}, {$and: [{date: req.query["dateTo"]}, {time: {$lte: req.query["timeTo"]}}]}]})
			}
		}
		else {
			if (req.query["dateFrom"] !== undefined) {
				date_filter.push({date: {$gte: req.query["dateFrom"]}})
			}
			if (req.query["dateTo"] !== undefined) {
				date_filter.push({date: {$lte: req.query["dateTo"]}})
			}
			if (req.query["timeFrom"] !== undefined) {
				date_filter.push({time: {$gte: req.query["timeFrom"]}})
			}
			if (req.query["timeTo"] !== undefined) {
				date_filter.push({time: {$lte: req.query["timeTo"]}})
			}
		}

		if (date_filter.length > 0) {
			filter["$and"] = date_filter
		}

		const docsCount = await Receipt.countDocuments(filter)

		let skip = 0;
		let limit = 10;
		const page = parseInt(req.query.page)
		const pageSize = parseInt(req.query.pageSize)
		
		if (isNaN(page) || isNaN(pageSize)) {
			return res.status(400).json({message: "page and pageSize are required"})
		}

		skip = (page - 1) * pageSize
		limit = pageSize

		const docs = await Receipt.aggregate([
			{$match: filter},
			{$sort: {_id: 1}},
			{$skip: skip},
			{$limit: limit}
		])
		.then(docs => docs.map(pojo => new Receipt(pojo)))

		res.json({receipts: docs, numberOfPages: Math.ceil(docsCount / pageSize)})
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
			return res.status(400).json({message: "Invalid id"})
		}
	}
)

module.exports = router
