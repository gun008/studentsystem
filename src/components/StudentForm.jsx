import { useEffect, useState } from 'react'
import Button from './Button'
import Input from './Input'
import React from 'react'
const EMPTY_FORM = { name: '', age: '', course: '', status: 'Active' }

export default function StudentForm({ mode, initialData, onSubmit, onCancel, isLoading, existingStudents, courses = [] }) {
  const getDefault = data => ({
    name: data?.name ?? '',
    age: data?.age ?? '',
    course: data?.course ?? '',
    status: data?.status ?? 'Active',
  })

  const [formData, setFormData] = useState(getDefault(initialData))
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setFormData(getDefault(initialData))
    setFormError('')
  }, [initialData, mode, courses])

  const isDirty = JSON.stringify(formData) !== JSON.stringify(getDefault(initialData))

  function confirmClose() {
    if (isDirty && !window.confirm('You have unsaved changes. Leave without saving?')) {
      return false
    }
    return true
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setFormError('')
  }

  function handleReset() {
    setFormData(getDefault(initialData))
    setFormError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...formData,
      name: formData.name.trim(),
      course: formData.course.trim(),
      age: formData.age,
      status: formData.status,
    }

    if (!payload.name || !payload.course || !payload.age) {
      setFormError('Please fill in all student fields.')
      return
    }

    const ageValue = Number(payload.age)
    if (Number.isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
      setFormError('Please enter a valid age between 1 and 120.')
      return
    }

    const duplicate = existingStudents.some(student => {
      if (initialData && student.id === initialData.id) return false
      return student.name.trim().toLowerCase() === payload.name.toLowerCase() && Number(student.age) === ageValue
    })

    if (duplicate) {
      setFormError('Duplicate student detected. This student already exists.')
      return
    }

    try {
      await onSubmit({ ...payload, age: ageValue })
    } catch (error) {
      setFormError(error.message)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      if (confirmClose()) onCancel()
    }

    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
      e.preventDefault()
      e.currentTarget.requestSubmit()
    }
  }

  const nameLength = formData.name.length
  const maxNameLength = 30

  return (
    <form className="student-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
      <div className="field-row">
        <Input
          label="Name"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value.slice(0, maxNameLength))}
          placeholder="Student name"
          maxLength={maxNameLength}
          error={Boolean(formError)}
        />
        <div className="char-counter">{nameLength} / {maxNameLength}</div>
      </div>

      <Input
        label="Age"
        type="number"
        value={formData.age}
        onChange={e => handleChange('age', e.target.value)}
        placeholder="Age"
        min="1"
        max="120"
        error={Boolean(formError)}
      />

      {courses.length > 0 ? (
        <div className="form-group">
          <label>Course</label>
          <select
            value={formData.course}
            onChange={e => handleChange('course', e.target.value)}
            className={Boolean(formError) ? 'error' : ''}
          >
            <option value="" disabled>Select a course</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      ) : (
        <Input
          label="Course"
          value={formData.course}
          onChange={e => handleChange('course', e.target.value)}
          placeholder="Course"
          error={Boolean(formError)}
        />
      )}

      <div className="form-group">
        <label>Status</label>
        <select
          value={formData.status}
          onChange={e => handleChange('status', e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {formError && <div className="form-error">{formError}</div>}

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={() => {
          if (confirmClose()) onCancel()
        }}>
          Cancel
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (mode === 'edit' ? 'Updating...' : 'Saving...') : (mode === 'edit' ? 'Update Student' : 'Add Student')}
        </Button>
      </div>
    </form>
  )
}

export { EMPTY_FORM }
