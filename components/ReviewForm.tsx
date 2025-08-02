'use client'
import React, { useState } from 'react'

interface ReviewFormData {
doctorName: string
doctorSpecialization: string
clinicName: string
doctorLocation: string
rating: number
reviewText: string
}

interface ReviewFormProps {
onSubmit: (data: ReviewFormData) => void
disabled?: boolean
buttonText?: string
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

function ReviewForm({
onSubmit,
disabled = false,
buttonText = 'Submit Review',
loadingText = 'Submitting...',
buttonColor = 'blue',
className = ''
}: ReviewFormProps) {
const [formData, setFormData] = useState<ReviewFormData>({
  doctorName: '',
  doctorSpecialization: '',
  clinicName: '',
  doctorLocation: '',
  rating: 0,
  reviewText: ''
  })

  const colors = colorStyles[buttonColor]

  const inputClass = `w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${colors.focus}
  focus:border-transparent`
  const textareaClass = `w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
  ${colors.focus} focus:border-transparent resize-y min-h-[100px]`
  const buttonClass = `w-full px-6 py-3 ${colors.bg} text-white rounded-md ${colors.hover} focus:outline-none
  focus:ring-2 ${colors.ring} focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
  duration-200 font-medium`

  const handleInputChange = (field: keyof ReviewFormData, value: string | number) => {
  setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (isFormValid()) {
  onSubmit(formData)
  }
  }

const isFormValid = () => {
  return formData.doctorName.trim() &&
         formData.rating > 0 &&
         formData.rating <= 5
}  // <- Need semicolon here

const isButtonDisabled = disabled || !isFormValid()  // <- Need line break before this

return (  // <- Need line break before this
  <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
    {/* Doctor Information Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Doctor Information</h3>

      {/* Doctor Name - Required */}
      <div>
        <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
          Doctor Name *
        </label>
        <input type="text" id="doctorName" value={formData.doctorName} onChange={(e)=> handleInputChange('doctorName',
        e.target.value)}
        placeholder="e.g., Dr. Sarah Johnson"
        className={inputClass}
        disabled={disabled}
        required
        aria-label="Doctor's full name"
        />
      </div>

      {/* Doctor Specialization */}
      <div>
        <label htmlFor="doctorSpecialization" className="block text-sm font-medium text-gray-700 mb-1">
          Specialization
        </label>
        <input type="text" id="doctorSpecialization" value={formData.doctorSpecialization} onChange={(e)=>
        handleInputChange('doctorSpecialization', e.target.value)}
        placeholder="e.g., Cardiology, Dermatology, Pediatrics"
        className={inputClass}
        disabled={disabled}
        aria-label="Doctor's specialization"
        />
      </div>

      {/* Clinic Name */}
      <div>
        <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
          Clinic/Hospital Name
        </label>
        <input type="text" id="clinicName" value={formData.clinicName} onChange={(e)=> handleInputChange('clinicName',
        e.target.value)}
        placeholder="e.g., City General Hospital"
        className={inputClass}
        disabled={disabled}
        aria-label="Clinic or hospital name"
        />
      </div>

      {/* Doctor Location */}
      <div>
        <label htmlFor="doctorLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input type="text" id="doctorLocation" value={formData.doctorLocation} onChange={(e)=>
        handleInputChange('doctorLocation', e.target.value)}
        placeholder="e.g., 123 Health St, Baghdad"
        className={inputClass}
        disabled={disabled}
        aria-label="Doctor's location or address"
        />
      </div>
    </div>

    {/* Rating Section */}
    <div>
      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
        Rating *
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={()=> handleInputChange('rating', star)}
          disabled={disabled}
          className={`text-2xl transition-colors duration-200 ${formData.rating >= star
          ? 'text-yellow-400 hover:text-yellow-500'
          : 'text-gray-300 hover:text-yellow-300'
          } disabled:cursor-not-allowed`}
          aria-label={`Rate ${star} stars`}
          >
          ★
        </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating > 0 ? `${formData.rating}/5 stars` : 'Select rating'}
        </span>
      </div>
    </div>

    {/* Review Text */}
    <div>
      <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
        Your Review
      </label>
      <textarea id="reviewText" value={formData.reviewText} onChange={(e)=> handleInputChange('reviewText', e.target.value)}
          placeholder="Share your experience with this doctor..."
          className={textareaClass}
          disabled={disabled}
          aria-label="Your review text"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={buttonClass}
        aria-label={disabled ? loadingText : buttonText}
      >
        {disabled ? loadingText : buttonText}
      </button>

      {/* Required Fields Note */}
      <p className="text-xs text-gray-500">
        * Required fields
      </p>
    </form>
  )
}

export default ReviewForm
