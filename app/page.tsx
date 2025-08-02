'use client'
import { useState } from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Menu, X, Star, TrendingUp, AlertTriangle, Clock, Users, Search, Plus } from 'lucide-react'

const CategoryCard = ({ icon: Icon, title, description, count, href, color = "blue" }) => {
 const colorClasses = {
   blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
   green: "bg-green-50 border-green-200 hover:bg-green-100", 
   red: "bg-red-50 border-red-200 hover:bg-red-100",
   yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
   purple: "bg-purple-50 border-purple-200 hover:bg-purple-100"
 }

 const iconColors = {
   blue: "text-blue-600",
   green: "text-green-600",
   red: "text-red-600", 
   yellow: "text-yellow-600",
   purple: "text-purple-600"
 }

 return (
   <Link href={href} className={`block p-6 rounded-xl border-2 transition-all duration-200 ${colorClasses[color]}`}>
     <div className="flex items-start gap-4">
       <div className={`p-3 rounded-lg bg-white ${iconColors[color]}`}>
         <Icon className="w-6 h-6" />
       </div>
       <div className="flex-1">
         <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
         <p className="text-gray-600 text-sm mb-3">{description}</p>
         <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
           {count} reviews
         </span>
       </div>
     </div>
   </Link>
 )
}

const page = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

 const toggleMobileMenu = () => {
   setIsMobileMenuOpen(!isMobileMenuOpen)
 }

 const categories = [
   {
     icon: Star,
     title: "Highest Rated Doctors", 
     description: "Top-rated physicians with 4.5+ star reviews from verified patients",
     count: "2,847",
     href: "/categories/highest-rated",
     color: "green"
   },
   {
     icon: TrendingUp,
     title: "Trending This Week",
     description: "Most searched and reviewed doctors in your area this week", 
     count: "892",
     href: "/categories/trending",
     color: "blue"
   },
   {
     icon: AlertTriangle,
     title: "Most Controversial",
     description: "Doctors with mixed reviews - see what patients really think",
     count: "423",
     href: "/categories/controversial", 
     color: "red"
   },
   {
     icon: Clock,
     title: "Recently Reviewed",
     description: "Latest patient experiences and feedback from this month",
     count: "1,234",
     href: "/categories/recent",
     color: "purple"
   },
   {
     icon: Users,
     title: "Most Reviewed",
     description: "Doctors with the highest number of patient reviews",
     count: "567", 
     href: "/categories/most-reviewed",
     color: "yellow"
   }
 ]

 return (
   <div className="min-h-screen bg-gray-50">
     <Header />
     
     {/* Mobile Menu Button */}
     <div className="lg:hidden fixed top-4 right-4 z-50">
       <button
         onClick={toggleMobileMenu}
         className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
       >
         {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
       </button>
     </div>

     {/* Mobile Slide Menu */}
     <div className={`lg:hidden fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
       isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
     }`}>
       <div className="p-6 pt-20">
         <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
         
         <div className="space-y-4">
           <Link 
             href="/search" 
             onClick={() => setIsMobileMenuOpen(false)}
             className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
           >
             <Search className="w-5 h-5 text-blue-600" />
             <div>
               <div className="font-medium text-gray-900">Search Doctors</div>
               <div className="text-sm text-gray-600">Find reviews by doctor name</div>
             </div>
           </Link>
           
           <Link 
             href="/review" 
             onClick={() => setIsMobileMenuOpen(false)}
             className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
           >
             <Plus className="w-5 h-5 text-green-600" />
             <div>
               <div className="font-medium text-gray-900">Write Review</div>
               <div className="text-sm text-gray-600">Share your experience</div>
             </div>
           </Link>
         </div>
       </div>
     </div>

     {/* Desktop Navigation */}
     <div className="hidden lg:block bg-white border-b border-gray-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-center space-x-8 py-4">
           <Link 
             href="/search"
             className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
           >
             <Search className="w-5 h-5" />
             Search Doctors
           </Link>
           <Link 
             href="/review"
             className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
           >
             <Plus className="w-5 h-5" />
             Write Review
           </Link>
         </div>
       </div>
     </div>

     {/* Hero Section */}
     <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
         <div className="text-center">
           <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6">
             Find the Right Doctor
           </h1>
           <p className="text-lg sm:text-xl lg:text-2xl mb-8 lg:mb-12 text-blue-100 max-w-3xl mx-auto">
             Read honest reviews from real patients and make informed healthcare decisions
           </p>
           
           {/* Mobile CTA Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:hidden">
             <Link 
               href="/search"
               className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
             >
               <Search className="w-5 h-5" />
               Search Reviews
             </Link>
             <Link 
               href="/review"
               className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-blue-400 flex items-center justify-center gap-2"
             >
               <Plus className="w-5 h-5" />
               Write Review
             </Link>
           </div>
         </div>
       </div>
     </div>

     {/* Main Content */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
       {/* Categories Section */}
       <div className="mb-12">
         <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-center">
           Browse by Category
         </h2>
         <p className="text-gray-600 text-center mb-8 lg:mb-12">
           Discover doctors based on patient feedback and ratings
         </p>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {categories.map((category, index) => (
             <CategoryCard key={index} {...category} />
           ))}
         </div>
       </div>

       {/* Stats Section */}
       <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8 mb-12">
         <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">
           Trusted by Patients Nationwide
         </h3>
         
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="text-center">
             <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">25K+</div>
             <div className="text-sm lg:text-base text-gray-600">Reviews Written</div>
           </div>
           <div className="text-center">
             <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">8K+</div>
             <div className="text-sm lg:text-base text-gray-600">Doctors Reviewed</div>
           </div>
           <div className="text-center">
             <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">150+</div>
             <div className="text-sm lg:text-base text-gray-600">Cities Covered</div>
           </div>
           <div className="text-center">
             <div className="text-2xl lg:text-3xl font-bold text-yellow-600 mb-2">4.8</div>
             <div className="text-sm lg:text-base text-gray-600">Average Rating</div>
           </div>
         </div>
       </div>

       {/* CTA Section */}
       <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-6 lg:p-8 text-center">
         <h3 className="text-xl lg:text-2xl font-bold mb-4">
           Help Others Make Better Healthcare Choices
         </h3>
         <p className="text-green-100 mb-6 max-w-2xl mx-auto">
           Share your experience with healthcare providers and help fellow patients find the right doctor for their needs.
         </p>
         <Link 
           href="/review"
           className="inline-flex items-center gap-2 bg-white text-green-600 px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
         >
           <Plus className="w-5 h-5" />
           Write Your First Review
         </Link>
       </div>
     </div>

     {/* Overlay for mobile menu */}
     {isMobileMenuOpen && (
       <div 
         className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
         onClick={() => setIsMobileMenuOpen(false)}
       />
     )}

     <Footer />
   </div>
 )
}

export default page
