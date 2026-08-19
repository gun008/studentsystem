import Button from './Button'
import React from 'react'
export default function StudentList({ students, onView, onEdit, onDelete }) {
  if (students.length === 0) {
    return <div className="empty-state">No students matched your search.</div>
  }

  return (
    <div className="student-table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td className="table-actions">
                <Button onClick={() => onView(student)} variant="secondary">View</Button>
                <Button onClick={() => onEdit(student)} variant="secondary">Edit</Button>
                <Button onClick={() => onDelete(student.id)} variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
