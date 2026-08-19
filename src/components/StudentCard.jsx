import Button from './Button'
import React from 'react'
export default function StudentCard({ student, onView, onEdit, onDelete }) {
  return (
    <div className="student-card">
      <div>
        <h4>{student.name}</h4>
        <p>{student.course}</p>
      </div>
      <div className="student-card-meta">
        <span>{student.age} yrs</span>
      </div>
      <div className="student-card-actions">
        <Button onClick={() => onView(student)} variant="secondary">View</Button>
        <Button onClick={() => onEdit(student)} variant="secondary">Edit</Button>
        <Button onClick={() => onDelete(student.id)} variant="danger">Delete</Button>
      </div>
    </div>
  )
}
