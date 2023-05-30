require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()

const receipt_controller = require("./controllers/ReceiptController.js")
const user_controller = require("./controllers/UserController.js")

app.use(cors())
app.use(express.json())

app.use("/api/receipt", receipt_controller)
app.use("/api/user", user_controller)

app.listen(8080, function() {console.log("serwer bzika")})