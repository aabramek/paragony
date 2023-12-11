const mongoose = require("../db.js")

var Decimal = require("decimal.js-light")

const receiptSchema = new mongoose.Schema({
	shop: {
		name: {
			type: String,
			trim: true,
			lowercase: true,
			minLength: [3, "Nazwa sklepu powinna mieć co najmniej 3 znaki"],
			required: [true, "Nazwa sklepu jest wymagana"]
		},

		city: {
			type: String,
			trim: true,
			lowercase: true,
			minLength: [3, "Nazwa miasta powinna mieć co najmniej 3 znaki"],
			required: [true, "Nazwa miasta jest wymagana"]
		},

		street: {
			type: String,
			trim: true,
			lowercase: true,
			minLength: [5, "Nazwa ulicy powinna mieć co najmniej 5 znaków"],
			required: [true, "Nazwa ulicy jest wymagana"]
		}
	},

	date: {
		type: String,
		trim: true,
		required: [true, "Data zakupu jest wymagana"],
		validate: [v => /^\d{4}-[0-1][0-9]-[0-3][0-9]$/.test(v), "{VALUE} nie spełnia wymaganego formatu danych: YYYY-MM-DD"]
	},

	time: {
		type: String,
		trim: true,
		required: [true, "Godzina zakupu jest wymagana"],
		validate: [v => /^[0-2][0-9]:[0-6][0-9]$/.test(v), "{VALUE} nie spełnia wymaganego formatu danych: HH:MM"]
	},

	products: {
		type: [{
			name: {
				type: String,
				trim: true,
				lowercase: true,
				required: [true, "Nazwa produktu jest wymagana"]
			},

			amount: {
				type: String,
				required: [true, "Ilość produktu jest wymagana"],
				validate: [v => /^\d+(\.\d{0,3})?$/.test(v) && new Decimal(v).greaterThanOrEqualTo("0.001"),
					"Ilość produktu musi być liczbą większą od 0.001 podaną z dokładnością do maksymalnie 3 miejsc po kropce"]
			},

			price: {
				type: String,
				required: [true, "Cena produktu jest wymagana"],
				validate: [v => /^\d+(\.\d{0,2})?$/.test(v) && new Decimal(v).greaterThanOrEqualTo("0.01"),
					"Cena produktu musi być liczbą większą od 0.01 podaną z dokładnością do maksymalnie 2 miejsc po kropce"]
			},

			discount: {
				type: String,
				required: false,
				validate: [v => /^\d+(\.\d{0,2})?$/.test(v) && new Decimal(v).greaterThanOrEqualTo("0"),
					"Zniżka ceny produktu musi być liczbą większą od 0 podaną z dokładnością do maksymalnie 2 miejsc po kropce"]
			},

			taxRate: {
				type: String,
				enum: {values: ["A", "B", "C", "D"], message: "Stawka podatkowa powinna być wybrana z listy: A, B, C lub D"},
				required: [true, "Stawka podatkowa produktu jest wymagana"]
			}
		}],

		validate: [v => v.length > 0, "Lista produktów nie może być pusta"]
	},

	total: {
		type: String,
		required: [true, "Łączna wartość zakupów jest wymagana"],
		validate: [v => /^\d+(\.\d{0,2})?$/.test(v) && new Decimal(v).greaterThanOrEqualTo("0"),
					"Cena łączna produktów musi być liczbą większą od 0 podaną z dokładnością do maksymalnie 2 miejsc po kropce"]
	},
	
	user_id: mongoose.SchemaTypes.ObjectId
})

const Receipt = mongoose.model("Receipt", receiptSchema)

module.exports = Receipt