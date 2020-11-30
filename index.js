const express = require('express')

const app = express()

app.use(express.json())

const persons = [
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
