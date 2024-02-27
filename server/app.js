const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//! routes
//user
app.use(require("./route/user"))

app.get("/", async (req, res) => {
    return res.send("Application initiated successfully");
});


module.exports = app