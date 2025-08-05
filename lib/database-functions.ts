import { supabase } from './supabase'

// Updated interfaces to match new schema
export interface Patient {
  id: string  // UUID in new schema
  name: string
  email: string
  phone?: string
  auth_user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string  // UUID in new schema
  doctor_name: string
  doctor_specialization?: string
  clinic_name?: string
  doctor_location?: string
  patient_id: string
  rating: number
  review_text?: string
  is_verified?: boolean
  is_approved?: boolean
  created_at?: string
  updated_at?: string
}

// Patient functions
export async function insertPatient(patientData: {
  name: string
  email: string
  phone?: string
  auth_user_id?: string
}) {
  return await supabase
    .from('patients_table')//selects patients_table
    .insert([{
      name: patientData.name.trim(),
      email: patientData.email.trim().toLowerCase(),
      phone: patientData.phone?.trim(),
      auth_user_id: patientData.auth_user_id
    }])
    .select()
}

export async function getPatientByEmail(email: string) {
  return await supabase
    .from('patients_table')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .single()
}

// Review functions
export async function insertReview(reviewData: {
  doctor_name: string
  doctor_specialization?: string
  clinic_name?: string
  doctor_location?: string
  patient_id: string
  rating: number
  review_text?: string
}) {
  return await supabase
    .from('reviews_table')
    .insert([{
      doctor_name: reviewData.doctor_name.trim(),
      doctor_specialization: reviewData.doctor_specialization?.trim(),
      clinic_name: reviewData.clinic_name?.trim(),
      doctor_location: reviewData.doctor_location?.trim(),
      patient_id: reviewData.patient_id,
      rating: reviewData.rating,
      review_text: reviewData.review_text?.trim(),
      is_verified: false,  // Default for new reviews
      is_approved: true    // Auto-approve for MVP
    }])
    .select()
}

export async function searchReviewsByDoctorName(doctorName: string) {
  return await supabase
    .from('reviews_table')
    .select('*')
    .ilike('doctor_name', `%${doctorName}%`)
    .eq('is_approved', true)  // Only show approved reviews
    .order('created_at', { ascending: false })
}

export async function getReviewsByPatient(patientId: string) {
  return await supabase
    .from('reviews_table')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
}

export async function getReviewsForDoctor(doctorName: string) {
  return await supabase
    .from('reviews_table')
    .select('*')
    .ilike('doctor_name', doctorName)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
}

// Get average rating for a doctor
export async function getDoctorAverageRating(doctorName: string) {
  const { data, error } = await supabase
    .from('reviews_table')
    .select('rating')
    .ilike('doctor_name', doctorName)
    .eq('is_approved', true)

  if (error || !data || data.length === 0) {
    return { averageRating: 0, totalReviews: 0 }
  }

  const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
  
  const averageRating = totalRating / data.length

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: data.length
  }
}
