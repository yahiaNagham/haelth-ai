'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from "../../../AdminLayout"

type Patient = {
  firstname: string
  lastname: string
  email: string
  dateOfBirth?: string
  gender?: string
}

export default function EditPatientPage() {
  const { id } = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatient = async () => {
      const res = await fetch(`/api/listepatient/${id}`)
      const data = await res.json()
      setPatient(data)
    }

    if (id) fetchPatient()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!patient) return
    setPatient({ ...patient, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient?.firstname || !patient?.lastname || !patient?.email || !patient?.gender) {
      setError("All fields are required!")
      return
    }

    const res = await fetch(`/api/listepatient/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...patient,
        gender: patient.gender === 'Male' || patient.gender === 'Female' ? patient.gender : 'Female', // تأكد من صحة القيمة
      }),
    })

    if (res.ok) {
      alert("Patient updated successfully!")
      router.push('/admin/listepatient')
    } else {
      alert("Error updating patient.")
    }
  }

  if (!patient) return <div>Loading...</div>

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Edit Patient</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black font-semibold mb-1 text-base">First Name</label>
              <input
                type="text"
                name="firstname"
                value={patient.firstname}
                onChange={handleChange}
                placeholder="First Name"
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 text-black"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1 text-base">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={patient.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 text-black"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-black font-semibold mb-1 text-base">Email</label>
              <input
                type="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 text-black"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1 text-base">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={patient.dateOfBirth?.split('T')[0]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 text-black"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1 text-base">Gender</label>
              <select
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring focus:ring-blue-300 text-black"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
