const express = require('express')

const app = express()
require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

// generate id function
const generateId = () => Math.floor(Math.random() * 1000000)

// route to get all people
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

// route to get phonebook length & current date/time
app.get('/info', (request, response) => {
  const phonebookLength = `Phonebook has info for ${Person.length} people`
  const currentDate = new Date()
  response.send(`<p>${phonebookLength}</p><p>${currentDate}</p>`)
})

// route to get person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// route to delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// route to add new person
app.post('/api/persons', (request, response) => {
  const { body } = request

  // error checks
  if (!body.name) {
    return response.status(400).json({
      error: 'Name is missing',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is missing',
    })
  }

  // if name already exists
  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique',
    })
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
