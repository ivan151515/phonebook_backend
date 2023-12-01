const mongoose = require("mongoose")
require("dotenv").config()
mongoose.set("strictQuery", false)

const url = process.env.MONGO_DB_URI

console.log("connecting to", url)

mongoose.connect(url)
  .then(console.log("connected to MongoDB"))
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: Number,
    minLength: 5,
    required: true
  },
})


personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
