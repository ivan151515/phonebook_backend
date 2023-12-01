const mongoose = require("mongoose")

if (process.argv.length<3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]
console.log(password)
const url =
  `mongodb+srv://ivanbatur:${password}@cluster0.utp464b.mongodb.net/noteApp?retryWrites=true&w=majority`
  //<username>:<password>@cluster0.utp464b.mongodb.net/?retryWrites=true&w=majority"
mongoose.set("strictQuery",false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model("Person", personSchema)

console.log(process.argv)
const person = new Person({
  name: process.argv[3],
  number: Number(process.argv[4]),
})

person.save().then(result => {
  console.log(result)
  mongoose.connection.close()
})