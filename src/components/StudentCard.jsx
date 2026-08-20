import Button from './Button'
import React from 'react'

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function StudentCard({ student, onView, onEdit, onDelete }) {
  const statusColor = student.status === 'Active' ? '#15803d' : '#9ca3af'

  return (
    <div className="student-card">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <h4 style={{ margin: 0 }}>{student.name}</h4>
          <span style={{
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: '4px',
            backgroundColor: statusColor,
            color: 'white',
            fontWeight: '600'
          }}>
            {student.status || 'Active'}
          </span>
        </div>
        <p style={{ margin: '4px 0', fontSize: '0.875rem' }}>{student.course}</p>
        {student.createdAt && <p style={{ margin: '2px 0', fontSize: '0.75rem', color: 'var(--muted)' }}>
          Added: {formatDate(student.createdAt)}
        </p>}
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
