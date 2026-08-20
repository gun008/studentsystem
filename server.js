import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { MongoClient } from 'mongodb'

const app = express()
const port = process.env.PORT || 3001
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017')

app.use(cors())
app.use(express.json())

function studentsCollection() {
  return client.db(process.env.MONGODB_DB || 'student_management').collection('students')
}

function cleanStudent(input) {
  return {
    name: String(input.name || '').trim(),
    age: Number(input.age),
    course: String(input.course || '').trim(),
    status: input.status === 'Inactive' ? 'Inactive' : 'Active',
  }
}

function validateStudent(student) {
  return student.name && student.course && Number.isInteger(student.age) && student.age > 0 && student.age <= 120
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/students', async (req, res, next) => {
  try {
    const students = await studentsCollection().find().sort({ createdAt: -1 }).toArray()
    res.json(students)
  } catch (error) {
    next(error)
  }
})

app.post('/api/students', async (req, res, next) => {
  try {
    const student = cleanStudent(req.body)
    if (!validateStudent(student)) return res.status(400).json({ error: 'Please provide a valid student.' })

    const duplicate = await studentsCollection().findOne({ name: student.name, age: student.age })
    if (duplicate) return res.status(409).json({ error: 'Duplicate student detected. This student already exists.' })

    const document = { ...student, id: randomUUID(), studentId: `STD${Date.now().toString().slice(-6)}`, createdAt: new Date() }
    await studentsCollection().insertOne(document)
    res.status(201).json(document)
  } catch (error) {
    next(error)
  }
})

app.patch('/api/students/:id', async (req, res, next) => {
  try {
    const updates = {}
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim()
    if (req.body.age !== undefined) updates.age = Number(req.body.age)
    if (req.body.course !== undefined) updates.course = String(req.body.course).trim()
    if (req.body.status !== undefined) updates.status = req.body.status === 'Inactive' ? 'Inactive' : 'Active'
    if ((updates.name !== undefined && !updates.name) ||
      (updates.course !== undefined && !updates.course) ||
      (updates.age !== undefined && (!Number.isInteger(updates.age) || updates.age <= 0 || updates.age > 120))) {
      return res.status(400).json({ error: 'Please provide a valid student.' })
    }

    if (updates.name !== undefined || updates.age !== undefined) {
      const current = await studentsCollection().findOne({ id: req.params.id })
      const duplicate = await studentsCollection().findOne({
        id: { $ne: req.params.id },
        name: updates.name ?? current?.name,
        age: updates.age ?? current?.age,
      })
      if (duplicate) return res.status(409).json({ error: 'Duplicate student detected. This student already exists.' })
    }

    const result = await studentsCollection().findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { returnDocument: 'after' },
    )
    if (!result) return res.status(404).json({ error: 'Student not found.' })
    res.json(result)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/students/:id', async (req, res, next) => {
  try {
    const result = await studentsCollection().deleteOne({ id: req.params.id })
    if (!result.deletedCount) return res.status(404).json({ error: 'Student not found.' })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'A database error occurred.' })
})

client.connect()
  .then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}`)))
  .catch(error => {
    console.error('Could not connect to MongoDB:', error)
    process.exit(1)
  })