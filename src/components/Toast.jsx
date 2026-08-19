import React from 'react'


export default function Toast({ toast, onClose }) {
  if (!toast) return null

  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  )
}
