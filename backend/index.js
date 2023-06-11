require("dotenv").config()

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

app.listen(process.env.PORT, function() {console.log(`Serwer działa na porcie ${process.env.PORT}`)})