const express = require('express')

const app = express()

app.use(express.json())

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
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// route to get phonebook length & current date/time
app.get('/info', (req, res) => {
  const phonebookLength = `Phonebook has info for ${persons.length} people`
  const currentDate = new Date()
  res.send(`<p>${phonebookLength}</p><p>${currentDate}</p>`)
})

// route to get person by id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// route to delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id === id)

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

  if (persons.map(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique',
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = [...persons, person]

  response.json(person)
})

// Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address http://localhost:3001/api/persons.

// Generate a new id for the phonebook entry with the Math.random function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
