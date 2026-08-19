import React from 'react'

export default function StudentDetails({ student }) {
  return (
    <div className="student-details">
      <div className="detail-row"><span>Name</span><strong>{student.name}</strong></div>
      <div className="detail-row"><span>Age</span><strong>{student.age}</strong></div>
      <div className="detail-row"><span>Course</span><strong>{student.course}</strong></div>
      <div className="detail-row"><span>ID</span><strong>{student.id}</strong></div>
    </div>
  )
}
