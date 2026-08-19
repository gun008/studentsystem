
import React from 'react'
export default function Input({ label, value, onChange, type = 'text', placeholder, maxLength, error, ...rest }) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={error ? 'input-error' : ''}
        {...rest}
      />
    </label>
  )
}
