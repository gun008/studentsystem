import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-box">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="Search students" />
    </div>
  )
}
