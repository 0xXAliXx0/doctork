'use client'
import React, { useState } from 'react'
import ReviewForm from './ReviewForm'
import { insertReview, insertPatient, getPatientByEmail } from '@/lib/database-functions'

// Example of how to use the new components
function ReviewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleReviewSubmit = async (reviewData: any) => {
    setIsSubmitting(true)
    setMessage('')
    
    try {
      // For MVP, you might get patient info from your auth system
      // or create a simple patient registration form
      
      // Example: Get current user's patient record
      const userEmail = 'user@example.com' // Get from your auth system
      
      let patientId: string
      
      // Try to get existing patient
      const { data: existingPatient, error: patientError } = await getPatientByEmail(userEmail)
      
      if (existingPatient) {
        patientId = existingPatient.id
      } else {
        // Create new patient record
        const { data: newPatient, error: createError } = await insertPatient({
          name: 'Current User', // Get from auth system
          email: userEmail
        })
        
        if (createError || !newPatient?.[0]) {
          throw new Error('Failed to create patient record')
        }
        
        patientId = newPatient[0].id
      }

      // Insert the review
      const { data: review, error: reviewError } = await insertReview({
        doctor_name: reviewData.doctorName,
        doctor_specialization: reviewData.doctorSpecialization,
        clinic_name: reviewData.clinicName,
        doctor_location: reviewData.doctorLocation,
        patient_id: patientId,
        rating: reviewData.rating,
        review_text: reviewData.reviewText
      })

      if (reviewError) {
        throw new Error('Failed to submit review')
      }

      setMessage('Review submitted successfully!')
      
    } catch (error) {
      setMessage('Error submitting review. Please try again.')
      console.error('Review submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Write a Doctor Review
      </h1>
      
      <ReviewForm
        onSubmit={handleReviewSubmit}
        disabled={isSubmitting}
        buttonText="Submit Review"
        loadingText="Submitting..."
        buttonColor="blue"
      />
      
      {message && (
        <div className={`mt-4 p-4 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default ReviewPage
