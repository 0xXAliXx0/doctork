'use client'
import React, { useState } from 'react'
import InputWithButton from '@/components/InputWithButton'
import { insertDoctor, searchDoctorsByName, Doctor } from '@/lib/doctorService'

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [newDoctorName, setNewDoctorName] = useState('')
  const [inserting, setInserting] = useState(false)
  const [results, setResults] = useState<Doctor[] | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    setLoading(true)
    try {
      const { data, error } = await searchDoctorsByName(searchTerm)
      if (error) console.error('Search error:', error)
      else setResults(data)
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInsert = async () => {
    if (!newDoctorName.trim()) return
    setInserting(true)
    try {
      const { data, error } = await insertDoctor(newDoctorName)
      if (error) console.error('Insert error:', error)
      else {
        console.log('Inserted:', data)
        setNewDoctorName('')
        setResults(null) // optional: clear results after adding
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setInserting(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Search for Doctor</h1>
        <InputWithButton value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onClick={handleSearch}
          placeholder="Enter doctor name"
          disabled={loading}
          buttonText="Search"
          loadingText="Searching..."
        />
      </div>

      {results && results.length > 0 && (
        <ul className="mb-8 space-y-2">
          {results.map((doctor) => (
            <li key={doctor.id} className="p-2 bg-gray-100 rounded-md">
              {doctor.name}
            </li>
          ))}
        </ul>
      )}

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
        <InputWithButton value={newDoctorName} onChange={(e) => setNewDoctorName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
          onClick={handleInsert}
          placeholder="Enter new doctor name"
          disabled={inserting}
          buttonText="Add Doctor"
          loadingText="Adding..."
          buttonColor="green"
        />
      </div>
    </div>
  )
}

export default Search
