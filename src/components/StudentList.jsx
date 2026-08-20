import Button from './Button'
import React from 'react'

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function StudentList({ students, onView, onEdit, onDelete, onToggleStatus }) {
  if (students.length === 0) {
    return <div className="empty-state">No students matched your search.</div>
  }

  return (
    <div className="student-table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Status</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td className="student-id">{student.studentId || '-'}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>
              <td>
                <button
                  className={`status-badge status-${(student.status || 'Active').toLowerCase()}`}
                  onClick={() => onToggleStatus && onToggleStatus(student.id)}
                  type="button"
                  title="Click to toggle status"
                >
                  {student.status || 'Active'}
                </button>
              </td>
              <td>{formatDate(student.createdAt)}</td>
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
