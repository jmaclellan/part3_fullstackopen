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

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
]

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
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// route to delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
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
