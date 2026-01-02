'use client';

import { useEffect, useState } from 'react';
import AdminLayout from "../AdminLayout";

interface Appointment {
  id: number;
  familyFname: string;
  familyLname: string;
  date: string;
  email: string;
  phone: string;
  testStatus: string;
  testType?: string;
  resultFile?: string;
  patientId: number;
}

export default function ConfirmedAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [testType, setTestType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointment/accepted');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      alert('Failed to fetch appointments');
    }
  };

  const handleSendClick = (id: number, patientId: number) => {
    setSelectedAppointmentId(id);
    setSelectedPatientId(patientId);
    setIsEditMode(false);
    setTestType('');
    setFile(null);
  };

  const handleEdit = (app: Appointment) => {
    setSelectedAppointmentId(app.id);
    setSelectedPatientId(app.patientId);
    setTestType(app.testType || '');
    setIsEditMode(true);
  };

  const handleDelete = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      const res = await fetch(`/api/medicaltest/delete/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
      await fetchAppointments();
      alert('Deleted successfully');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !testType || selectedAppointmentId === null || selectedPatientId === null) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('testType', testType);
    formData.append('file', file);
    formData.append('appointmentId', selectedAppointmentId.toString());
    formData.append('patientId', selectedPatientId.toString());

    try {
      const res = await fetch(
        isEditMode
          ? `/api/medicaltest/update/${selectedAppointmentId}`
          : `/api/medicaltest/scan`,
        {
          method: isEditMode ? 'PATCH' : 'POST',
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      await fetchAppointments();
      alert(isEditMode ? 'Updated successfully' : 'Submitted successfully');
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedAppointmentId(null);
    setSelectedPatientId(null);
    setTestType('');
    setFile(null);
    setIsEditMode(false);
  };

  return (
    <AdminLayout>
    <div className="p-6 max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-8 text-[#1A76D1] p-2 rounded-lg shadow-lg">
  Upload Test Result
</h2>

      {selectedAppointmentId && (
        <form
          onSubmit={handleFormSubmit}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-xl p-6 rounded-xl border-2 border-[#1A76D1] z-50 w-full max-w-md"
        >
          <h3 className="text-2xl font-semibold mb-4 text-center text-[#1A76D1]">
            {isEditMode ? 'Update Test Result' : 'Send Test Result'}
          </h3>
          <div className="space-y-4">
            <label className="block font-medium text-black">
              Test Type:
              <input
                type="text"
                className="w-full p-3 mt-1 border rounded-md focus:ring-2 focus:ring-[#1A76D1] focus:outline-none"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="block font-medium text-black">
              Upload File:
              <input
                type="file"
                className="w-full p-3 mt-1 border rounded-md"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                disabled={isSubmitting}
              />
            </label>
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-[#1A76D1] text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : isEditMode ? 'Update' : 'Send'}
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 disabled:bg-gray-300 transition duration-300"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 text-left">
          <thead className="bg-[#1A76D1] text-white">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-center">Patient Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-center">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-center">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-center">Phone</th>
              <th className="px-6 py-4 text-sm font-semibold text-center">Test Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((app, idx) => (
              <tr key={app.id} className={idx % 2 === 0 ? 'bg-[#e8f1fb]' : ''}>
                <td className="px-6 py-4 text-sm text-black text-center font-medium">
                  {app.familyFname} {app.familyLname}
                </td>
                <td className="px-6 py-4 text-sm text-black text-center">
                  {new Date(app.date).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4 text-sm text-black text-center">{app.email}</td>
                <td className="px-6 py-4 text-sm text-black text-center">{app.phone}</td>
                <td className="px-6 py-4 text-sm text-black text-center">
                  <span className={`px-4 py-2 rounded-full text-xs font-medium ${app.testStatus === 'Sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {app.testStatus === 'Sent' && app.testType
                      ? `Sent (${app.testType})`
                      : app.testStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {app.testStatus === 'Sent' ? (
                      <>
                        <a
                          href={app.resultFile ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded bg-green-100 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200 transition duration-300"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleEdit(app)}
                          className="inline-flex items-center rounded bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="inline-flex items-center rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 transition duration-300"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="inline-flex items-center rounded bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200 transition duration-300"
                        onClick={() => handleSendClick(app.id, app.patientId)}
                      >
                        Send
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
}
