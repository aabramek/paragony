const mongoose = require("../db.js")

const receiptSchema = new mongoose.Schema({
	shop: {
		name: String,
		city: String,
		street: String
	},

	datetime: String,

	products: [
		{
			name: String,
			amount: Number,
			price: Number,
			discount: Number,
			taxRate: String
		}
	],

	total: Number,
	
	user_id: mongoose.SchemaTypes.ObjectId
})

const Receipt = mongoose.model("Receipt", receiptSchema)

module.exports = Receipt