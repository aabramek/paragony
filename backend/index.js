require("dotenv").config()

var fs = require("fs")

const express = require("express")
const cors = require("cors")
const app = express()

const receipt_controller = require("./controllers/ReceiptController.js")
const user_controller = require("./controllers/UserController.js")
const statistic_controller = require("./controllers/StatisticController.js")

app.use(cors())
app.use(express.json())

app.use("/api/receipt", receipt_controller)
app.use("/api/user", user_controller)
app.use("/api/statistic", statistic_controller)

if (process.env.SOCKET) {
	app.listen(process.env.SOCKET, function () {
		console.log(`Server listens on socket ${process.env.SOCKET}`)
	})
	fs.chmodSync(process.env.SOCKET, "660")
}
else if (process.env.PORT) {
	app.listen(process.env.PORT, function () {
		console.log(`Server listens on port ${process.env.PORT}`)
	})
}
else {
	console.log("Nor SOCKET nor PORT variables are defined")
}
