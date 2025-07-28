'use client'

import React from 'react'

interface InputWithButtonProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClick: () => void
  placeholder?: string
  disabled?: boolean
  buttonText: string
  loadingText?: string
  buttonColor?: 'blue' | 'green' | 'red'
  className?: string
}

const colorStyles = {
  blue: {
    focus: 'focus:ring-blue-500',
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    ring: 'focus:ring-blue-500'
  },
  green: {
    focus: 'focus:ring-green-500',
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    ring: 'focus:ring-green-500'
  },
  red: {
    focus: 'focus:ring-red-500',
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    ring: 'focus:ring-red-500'
  }
}

function InputWithButton({
  value,
  onChange,
  onKeyDown,
  onClick,
  placeholder = '',
  disabled = false,
  buttonText,
  loadingText = 'Loading...',
  buttonColor = 'blue',
  className = ''
}: InputWithButtonProps) {
  const colors = colorStyles[buttonColor]

  const inputClass = `flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent`

  const buttonClass = `px-6 py-2 ${colors.bg} text-white rounded-md ${colors.hover} focus:outline-none focus:ring-2 ${colors.ring} focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onClick()
    }
    onKeyDown?.(e)
  }

  const isButtonDisabled = disabled || !value.trim()

  return (
    <div className={`flex gap-2 mb-4 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClass}
        disabled={disabled}
        aria-label={placeholder || 'Text input'}
      />
      <button
        onClick={onClick}
        disabled={isButtonDisabled}
        className={buttonClass}
        type="button"
        aria-label={disabled ? loadingText : buttonText}
      >
        {disabled ? loadingText : buttonText}
      </button>
    </div>
  )
}

export default InputWithButton
