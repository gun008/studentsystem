import React from 'react'

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function StudentDetails({ student }) {
  const statusColor = student.status === 'Active' ? '#15803d' : '#9ca3af'
  
  return (
    <div className="student-details">
      <div className="detail-row"><span>Student ID</span><strong>{student.studentId || student.id}</strong></div>
      <div className="detail-row"><span>Name</span><strong>{student.name}</strong></div>
      <div className="detail-row"><span>Age</span><strong>{student.age} years old</strong></div>
      <div className="detail-row"><span>Course</span><strong>{student.course}</strong></div>
      <div className="detail-row">
        <span>Status</span>
        <strong style={{ color: statusColor, fontWeight: '600' }}>
          {student.status || 'Active'}
        </strong>
      </div>
      <div className="detail-row"><span>Date Added</span><strong>{formatDate(student.createdAt)}</strong></div>
    </div>
  )
}
