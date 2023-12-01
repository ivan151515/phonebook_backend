const personRouter = require("express").Router()
const Person = require("../models/person")

personRouter.get("", (req, res, next) => {
  Person.find({}).then(r => {
    console.log(r)
    return res.json(r)
  }).catch(err => {
    next(err)
  })
})
personRouter.post("/", (req, response, next) => {

  const person = new Person({ name: req.body.name, number: Number(req.body.number) })
  person.save()
    .then(p => response.json(p))
    .catch(err => next(err))


})
personRouter.get("/info", (req, res, next) => {
  const date = new Date()
  Person.countDocuments().then( r => {
    console.log(r)
    return res.send(`<div>
            Phonebook has info for ${r} people <br/>
            ${date}
            <div/>`)
  }).catch(err => next(err))

})
personRouter.get("/:id", (req, res, next) => {
  Person.findById(req.params.id).then(p => {
    if (p) {
      res.json(p)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})


personRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(
    res.status(204).end()).catch(error => next(error))

})
personRouter.put("/:id", (request,res,next) => {
  const { name, number } = request.body

  const person = { name, number }

  Person.findByIdAndUpdate(request.params.id, person, { new : true, runValidators:true, context: "query" })
    .then(updated => {
      res.json(updated)
    })
    .catch(err => next(err))
})


module.exports = personRouter