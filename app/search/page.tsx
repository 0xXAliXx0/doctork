"use client"
import React, { useState, useEffect } from 'react'
import { Search, Star, MapPin, Building2, Stethoscope, User, Calendar, AlertCircle } from 'lucide-react'
import { searchReviewsByDoctorName, getDoctorAverageRating } from '@/lib/database-functions'
import type { Review } from '@/lib/database-functions'

const StarRating = ({ rating, size = 'sm' }) => {
 const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'
 
 return (
   <div className="flex items-center gap-1">
     {[1, 2, 3, 4, 5].map((star) => (
       <Star
         key={star}
         className={`${sizeClass} ${
           star <= rating 
             ? 'fill-yellow-400 text-yellow-400' 
             : 'text-gray-300'
         }`}
       />
     ))}
     <span className="ml-1 text-sm text-gray-600">({rating})</span>
   </div>
 )
}

const ReviewCard = ({ review }: { review: Review }) => {
 const formatDate = (dateString?: string) => {
   if (!dateString) return 'Date not available'
   return new Date(dateString).toLocaleDateString('en-US', {
     year: 'numeric',
     month: 'short',
     day: 'numeric'
   })
 }

 return (
   <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
     <div className="flex items-start justify-between mb-4">
       <div className="flex-1">
         <h3 className="text-xl font-semibold text-gray-900 mb-2">
           {review.doctor_name}
         </h3>
         
         <div className="space-y-2 text-sm text-gray-600">
           {review.doctor_specialization && (
             <div className="flex items-center gap-2">
               <Stethoscope className="w-4 h-4" />
               <span>{review.doctor_specialization}</span>
             </div>
           )}
           {review.clinic_name && (
             <div className="flex items-center gap-2">
               <Building2 className="w-4 h-4" />
               <span>{review.clinic_name}</span>
             </div>
           )}
           {review.doctor_location && (
             <div className="flex items-center gap-2">
               <MapPin className="w-4 h-4" />
               <span>{review.doctor_location}</span>
             </div>
           )}
         </div>
       </div>
       
       <div className="text-right">
         <StarRating rating={review.rating} />
       </div>
     </div>

     {review.review_text && (
       <div className="mb-4">
         <p className="text-gray-700 leading-relaxed">
           "{review.review_text}"
         </p>
       </div>
     )}

     <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
       <div className="flex items-center gap-2">
         <User className="w-4 h-4" />
         <span>Anonymous Patient</span>
       </div>
       <div className="flex items-center gap-2">
         <Calendar className="w-4 h-4" />
         <span>{formatDate(review.created_at)}</span>
       </div>
     </div>
   </div>
 )
}

const SearchDoctor = () => {
 const [searchTerm, setSearchTerm] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const [reviews, setReviews] = useState<Review[]>([])
 const [hasSearched, setHasSearched] = useState(false)
 const [error, setError] = useState<string | null>(null)
 const [doctorStats, setDoctorStats] = useState<{
   averageRating: number
   totalReviews: number
 } | null>(null)

 useEffect(() => {
   if (!searchTerm.trim()) {
     setReviews([])
     setHasSearched(false)
     setDoctorStats(null)
     setError(null)
     return
   }

   setIsLoading(true)
   setError(null)

   const timeoutId = setTimeout(async () => {
     try {
       const { data: reviewsData, error: reviewsError } = await searchReviewsByDoctorName(searchTerm)
       
       if (reviewsError) {
         setError('Failed to search reviews. Please try again.')
         setReviews([])
       } else {
         setReviews(reviewsData || [])
         
         if (reviewsData && reviewsData.length > 0) {
           const exactMatch = reviewsData.find(review => 
             review.doctor_name.toLowerCase() === searchTerm.toLowerCase()
           )
           
           if (exactMatch) {
             const stats = await getDoctorAverageRating(exactMatch.doctor_name)
             setDoctorStats(stats)
           }
         }
       }
       
       setHasSearched(true)
     } catch (err) {
       setError('An unexpected error occurred. Please try again.')
       setReviews([])
     } finally {
       setIsLoading(false)
     }
   }, 300)

   return () => clearTimeout(timeoutId)
 }, [searchTerm])

 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
   setSearchTerm(e.target.value)
 }

 const clearSearch = () => {
   setSearchTerm('')
   setReviews([])
   setHasSearched(false)
   setError(null)
   setDoctorStats(null)
 }

 return (
   <div className="max-w-4xl mx-auto p-6">
     <div className="text-center mb-8">
       <h1 className="text-3xl font-bold text-gray-900 mb-2">
         Find Doctor Reviews
       </h1>
       <p className="text-gray-600">
         Search for doctors by name, specialization, or clinic
       </p>
     </div>

     <div className="relative mb-8">
       <div className="relative">
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
         <input
           type="text"
           placeholder="Search for doctors..."
           value={searchTerm}
           onChange={handleSearch}
           className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
         />
         {searchTerm && (
           <button
             onClick={clearSearch}
             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
           >
             ✕
           </button>
         )}
       </div>
     </div>

     {error && (
       <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
         <div className="flex items-center gap-2 text-red-800">
           <AlertCircle className="w-5 h-5" />
           <span className="font-medium">Error</span>
         </div>
         <p className="text-red-700 mt-1">{error}</p>
       </div>
     )}

     {isLoading && (
       <div className="text-center py-12">
         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
         <p className="mt-4 text-gray-600">Searching...</p>
       </div>
     )}

     {!isLoading && hasSearched && !error && (
       <div>
         {reviews.length > 0 ? (
           <>
             <div className="mb-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-xl font-semibold text-gray-900">
                     Found {reviews.length} review{reviews.length === 1 ? '' : 's'}
                   </h2>
                   <p className="text-gray-600">
                     Showing results for "{searchTerm}"
                   </p>
                 </div>
                 
                 {doctorStats && doctorStats.totalReviews > 0 && (
                   <div className="text-right">
                     <div className="flex items-center gap-2 justify-end mb-1">
                       <StarRating rating={doctorStats.averageRating} />
                     </div>
                     <p className="text-sm text-gray-600">
                       {doctorStats.averageRating}/5 • {doctorStats.totalReviews} reviews
                     </p>
                   </div>
                 )}
               </div>
             </div>
             
             <div className="space-y-6">
               {reviews.map((review) => (
                 <ReviewCard key={review.id} review={review} />
               ))}
             </div>
           </>
         ) : (
           <div className="text-center py-12">
             <div className="mb-4">
               <Search className="w-16 h-16 text-gray-300 mx-auto" />
             </div>
             <h3 className="text-xl font-semibold text-gray-900 mb-2">
               No reviews found
             </h3>
             <p className="text-gray-600 mb-4">
               No reviews found for "{searchTerm}". Try a different search term.
             </p>
             <button
               onClick={clearSearch}
               className="text-blue-600 hover:text-blue-700 font-medium"
             >
               Clear search
             </button>
           </div>
         )}
       </div>
     )}

     {!hasSearched && !searchTerm && (
       <div className="text-center py-12">
         <div className="mb-4">
           <Search className="w-16 h-16 text-gray-300 mx-auto" />
         </div>
         <h3 className="text-xl font-semibold text-gray-900 mb-2">
           Start your search
         </h3>
         <p className="text-gray-600">
           Enter a doctor's name to find reviews
         </p>
       </div>
     )}
   </div>
 )
}

export default SearchDoctor
