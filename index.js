const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")
const cookieParser = require('cookie-parser')
require('dotenv').config()
const exception = require("./middleware/exception.middleware")

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({credentials: true, origin: process.env.API_CLIENT, optionsSuccessStatus: 200}))
app.use(cookieParser())
app.use(morgan("dev"))
app.use("/api/auth/", require("./routes/auth.route"))
app.use("/api/posts/", require("./routes/posts.route"))
app.use(exception)

async function start() {
  try {
    const connect = await mongoose.connect(process.env.API_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true})
    if (connect) console.log("Connected to mongoDB")

    app.listen(PORT, () => console.log(`Server started on port ${ PORT }`))
  } catch (err) {console.log(err.message)}
}
start()