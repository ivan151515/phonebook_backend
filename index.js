const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const axios = require("axios")
const URL = "http://localhost:3001/persons/"
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', 
function (req, res) { 
    return req.body.data
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
app.use(express.json())
app.get("/api/persons", (req, res) => {
    axios.get(URL).then(r => {
        return res.json(r.data)
    }).catch(err => {
        res.send("<h1>Error<h1/>")
    })
})
app.post("/api/persons", (req, res) => {
    const body = req.body
    if (!req.body.name || !req.body.number) {
        return res.send("<h1>Name and/or number missing")
    }
    axios.get(URL).then(x => {
        const persons = x.data.filter(p => p.name === body.name)
        console.log(persons)
        if (!persons.length) {
            axios.post(URL, body).then(r => {
                res.json(r.data)
            }).catch(err => {
                res.send("<h1>Error<h1/>")
            })
        } else {
            res.send("<h1>Name already in use<h1/>")
        }
    })
    
})
app.get("/api/persons/:id", (req, res) => {
    console.log("WOOOHOO")
    axios.get(URL + "/" + req.params.id).then(r => {
        console.log()
        return res.json(r.data)
    }).catch(err => {
        res.send("<h1>Error<h1/>")
    })
})
app.delete("/api/persons/:id", (req, res) => {
    axios.delete(URL + "/"+ req.params.id).then(r => {
        console.log("deleted")
        res.redirect("/api/persons")
    }).catch(err => {
        res.send("<h1>Error<h1/>")
    })
})
app.get("/info", (req, res) => {
    date = new Date()
    axios.get(URL).then(r => {
        console.log(r)
        return res.send(`<div>
        Phonebook has info for ${r.data.length} people <br/>
        ${date}
        <div/>`)
    }).catch(err => {
        res.send("<h1>Error<h1/>")
    })
})
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})