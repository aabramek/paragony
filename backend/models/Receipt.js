const mongoose = require("../db.js")

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
				type: mongoose.Decimal128,
				required: [true, "Ilość produktu jest wymagana"],
				validate: [v => v >= new mongoose.Types.Decimal128("0.001"),
					"Ilość produktu musi być liczbą większą od  bądź równą 0.001"],
				transform: value => value.toString()
			},

			price: {
				type: mongoose.Decimal128,
				required: [true, "Cena produktu jest wymagana"],
				validate: [v => v >= new mongoose.Types.Decimal128("0.01"),
					"Cena produktu musi być liczbą większą od bądź równą 0.01"],
				transform: value => value.toString()
			},

			discount: {
				type: mongoose.Decimal128,
				required: false,
				validate: [v => v >= new mongoose.Types.Decimal128("0"),
					"Zniżka ceny produktu musi być liczbą większą bądź równą 0"],
				transform: value => value ? value.toString() : "0"
			},

			taxRate: {
				type: String,
				enum: {values: ["A", "B", "C", "D"],
				message: "Stawka podatkowa powinna być wybrana z listy: A, B, C lub D"},
				required: [true, "Stawka podatkowa produktu jest wymagana"]
			}
		}],

		validate: [v => v.length > 0, "Lista produktów nie może być pusta"]
	},

	total: {
		type: mongoose.Decimal128,
		required: [true, "Łączna wartość zakupów jest wymagana"],
		validate: [v => v > 0, "Cena łączna produktów musi być liczbą większą od 0"],
		transform: value => value.toString()
	},
	
	user_id: mongoose.SchemaTypes.ObjectId
})

const Receipt = mongoose.model("Receipt", receiptSchema)

module.exports = Receipt