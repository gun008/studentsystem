import React, { useState, useEffect, useMemo } from 'react'
import Button from './components/Button'
import SearchBar from './components/SearchBar'
import Modal from './components/Modal'
import Toast from './components/Toast'
import StudentCard from './components/StudentCard'
import StudentDetails from './components/StudentDetails'
import StudentForm, { EMPTY_FORM } from './components/StudentForm'
import StudentList from './components/StudentList'

const PAGE_SIZE = 5

export default function App() {
  const [students, setStudents] = useState(() => {
    const raw = localStorage.getItem('students')
    return raw ? JSON.parse(raw) : []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [modalMode, setModalMode] = useState('add')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return students

    return students.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    )
  }, [students, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const recentStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
      .slice(0, 5)
  }, [students])

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredStudents.slice(start, start + PAGE_SIZE)
  }, [filteredStudents, currentPage])

  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function openAddModal() {
    setModalMode('add')
    setSelectedStudent(null)
    setIsModalOpen(true)
  }

  function openEditModal(student) {
    setModalMode('edit')
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  function openViewModal(student) {
    setModalMode('view')
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedStudent(null)
  }

  async function submitStudent(payload) {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 600))

    const normalized = {
      ...payload,
      name: payload.name.trim(),
      course: payload.course.trim(),
      age: Number(payload.age),
      createdAt: new Date().toISOString(),
    }

    const duplicate = students.some(student => {
      if (modalMode === 'edit' && selectedStudent && student.id === selectedStudent.id) return false
      return student.name.trim().toLowerCase() === normalized.name.toLowerCase() && Number(student.age) === normalized.age
    })

    if (duplicate) {
      setIsSubmitting(false)
      throw new Error('Duplicate student detected. This student already exists.')
    }

    if (modalMode === 'edit' && selectedStudent) {
      setStudents(prev => prev.map(student =>
        student.id === selectedStudent.id
          ? { ...student, ...normalized, id: selectedStudent.id }
          : student
      ))
      showToast('Student updated successfully.')
    } else {
      const newStudent = { ...normalized, id: Date.now().toString() }
      setStudents(prev => [newStudent, ...prev])
      showToast('Student added successfully.')
    }

    setIsSubmitting(false)
    setCurrentPage(1)
    closeModal()
  }

  function deleteStudent(id) {
    const student = students.find(item => item.id === id)
    if (!student) return

    const confirmed = window.confirm(`Delete ${student.name}? This action cannot be undone.`)
    if (!confirmed) return

    setStudents(prev => prev.filter(item => item.id !== id))
    showToast('Student deleted successfully.')
  }

  function handleModalKeyDown(event) {
    if (event.key === 'Escape' && isModalOpen) {
      event.preventDefault()
      closeModal()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleModalKeyDown)
    return () => window.removeEventListener('keydown', handleModalKeyDown)
  }, [isModalOpen])

  return (
    <div className="container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <header className="topbar">
        <div>
          <p className="eyebrow">Student records</p>
          <h1>Student Management</h1>
        </div>
        <Button onClick={openAddModal}>+ Add Student</Button>
      </header>

      <div className="content-grid">
        <aside className="panel recent-panel">
          <h3>Recently Added</h3>
          <div className="recent-list">
            {recentStudents.length === 0 ? (
              <p className="empty-text">No recent students yet.</p>
            ) : (
              recentStudents.map(student => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onView={openViewModal}
                  onEdit={openEditModal}
                  onDelete={deleteStudent}
                />
              ))
            )}
          </div>
        </aside>

        <main className="panel main-panel">
          <div className="toolbar">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <span className="result-count">{filteredStudents.length} students</span>
          </div>

          <StudentList
            students={paginatedStudents}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={deleteStudent}
          />

          <div className="pagination">
            <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages}>
              Next
            </Button>
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen && modalMode !== 'view'} title={modalMode === 'edit' ? 'Edit Student' : 'Add Student'} onClose={closeModal}>
        <StudentForm
          mode={modalMode}
          initialData={selectedStudent || EMPTY_FORM}
          existingStudents={students}
          onSubmit={submitStudent}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal isOpen={isModalOpen && modalMode === 'view'} title="Student Details" onClose={closeModal}>
        {selectedStudent && <StudentDetails student={selectedStudent} />}
      </Modal>
    </div>
  )
}
