const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const axios = require("axios")
const URL = "/persons/"
const app = express()
const Person = require("./models/person")



app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', 
function (req, res) { 
    return req.body.data
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
app.use(express.json())
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
  }

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  // this has to be the last loaded middleware.
app.get("/api/persons", (req, res) => {
    Person.find({}).then(r => {
        console.log(r)
        return res.json(r)
    }).catch(err => {
        res.send("<h1>Error<h1/>")
    })
})
app.post("/api/persons", (req, response, next) => {
    const body = req.body
    
    const person = new Person({name: req.body.name, number: Number(req.body.number)})
    person.save()
                .then(p => response.json(p))
                .catch(err => next(err))
    
    
})
app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(p => {
        if (p) {
            res.json(p)
          } else {
            res.status(404).end()
          }
        })
        .catch(error => next(error))
})
    

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(r => {
        res.status(204).end()
    }).catch(error => next(error))
    
})
app.put("/api/persons/:id", (req,res,next) => {
    const { name, number } = request.body

    const person = {name, number}

    Person.findByIdAndUpdate(req.params.id, person, {new : true, runValidators:true, context: "query"})
          .then(updated => {
            res.json(updated)
          })
          .catch(err => next(err))
})
app.get("/api/info", (req, res, next) => {
    date = new Date()
    Person.countDocuments().then( r => {
        console.log(r)
        return res.send(`<div>
        Phonebook has info for ${r} people <br/>
        ${date}
        <div/>`)
    }).catch(err => next(err))
    
})
app.use(unknownEndpoint)

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})