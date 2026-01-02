'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import AdminLayout from "../AdminLayout"

type Patient = {
  id: number
  firstname: string
  lastname: string
  email: string
  dateOfBirth?: string
  gender?: 'Male' | 'Female' 
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const router = useRouter()

  const fetchPatients = async () => {
    const res = await fetch('/api/listepatient')
    const data = await res.json()
    setPatients(data)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return
    await fetch(`/api/listepatient/${id}`, { method: 'DELETE' })
    setPatients(patients.filter(p => p.id !== id))
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filteredPatients = patients.filter(patient =>
    patient.firstname.toLowerCase().includes(search.toLowerCase()) ||
    patient.lastname.toLowerCase().includes(search.toLowerCase()) ||
    patient.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white shadow-md p-4 rounded-lg bg-gradient-to-r from-customBlue to-blue-700">
          Patients List
        </h1>

        {/* Search Field with Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by Name or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-customBlue transition duration-200 text-black placeholder-gray-500"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-customBlue text-white">
              <th className="border px-8 py-3">First Name</th>
              <th className="border px-8 py-3">Last Name</th>
              <th className="border px-8 py-3">Email</th>
              <th className="border px-8 py-3">Date of Birth</th>
              <th className="border px-8 py-3">Gender</th>
              <th className="border px-8 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredPatients.map((patient, idx) => (
              <tr key={patient.id} className={idx % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                <td className="border border-gray-300 px-8 py-3">{patient.firstname}</td>
                <td className="border border-gray-300 px-8 py-3">{patient.lastname}</td>
                <td className="border border-gray-300 px-8 py-3">{patient.email}</td>
                <td className="border border-gray-300 px-8 py-3">{patient.dateOfBirth?.split('T')[0] || '—'}</td>
                <td className="border border-gray-300 px-8 py-3">
                  {patient.gender ? (patient.gender === 'Male' ? 'Male' : 'Female') : '—'}
                </td>
                <td className="border border-gray-300 px-8 py-3 flex space-x-2 justify-center">
                  <button
                    onClick={() => router.push(`/admin/listepatient/edit/${patient.id}`)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition duration-200"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
