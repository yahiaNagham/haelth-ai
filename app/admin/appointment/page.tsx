'use client';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import AdminLayout from "../AdminLayout";

interface Appointment {
  id: number;
  familyFname: string;
  familyLname: string;
  date: string;
  time: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  phone?: string;
  email: string;
}

export default function AppointmentsTable() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showRejectionBox, setShowRejectionBox] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState('');

  const rejectionReasons = [
    'Time unavailable',
    'Invalid or unsuitable appointment date',
    'Laboratory closed or on holiday',
    'Appointment is fully booked',
    'Information provided is incomplete or incorrect',
    'Appointment already booked at this time',
    'Test type not available at this laboratory',
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/checkappointment/all');
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };
    fetchAppointments();
  }, []);

  const extractTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConfirm = async (id: number) => {
    const res = await fetch(`/api/checkappointment/${id}/confirm`, { method: 'PUT' });
    if (res.ok) {
      setAppointments((prev) =>
        prev.map((appt) => appt.id === id ? { ...appt, status: 'Confirmed' } : appt)
      );
    }
  };

  const handleRejectClick = (id: number) => {
    setSelectedAppointmentId(id);
    setShowRejectionBox(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedAppointmentId || !selectedReason) return;
    const res = await fetch(`/api/checkappointment/${selectedAppointmentId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: selectedReason }),
    });

    if (res.ok) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === selectedAppointmentId
            ? { ...appt, status: 'Cancelled', notes: selectedReason }
            : appt
        )
      );
      setShowRejectionBox(false);
      setSelectedAppointmentId(null);
      setSelectedReason('');
    }
  };

  const handleCancelReject = () => {
    setShowRejectionBox(false);
    setSelectedAppointmentId(null);
    setSelectedReason('');
  };

  return (
    <AdminLayout>
      <div className="max-w-screen-xl mx-auto p-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-[#1A76D1] p-2 rounded-lg shadow-lg">
          Appointment List
        </h2>

        {showRejectionBox && (
          <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg border w-96">
            <h3 className="text-lg font-semibold mb-4">Select Rejection Reason:</h3>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 bg-white text-black"
            >
              <option value="">-- Select a Reason --</option>
              {rejectionReasons.map((reason, index) => (
                <option key={index} value={reason} className="text-black bg-white">
                  {reason}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleRejectSubmit}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Submit
              </button>
              <button
                onClick={handleCancelReject}
                className="text-black border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-sm text-left text-gray-700 bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, idx) => (
                <tr key={appt.id} className={idx % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                  <td className="px-6 py-4">{appt.familyFname}</td>
                  <td className="px-6 py-4">{appt.familyLname}</td>
                  <td className="px-6 py-4">{new Date(appt.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{appt.time ? extractTime(appt.time) : 'Not set'}</td>
                  <td className="px-6 py-4">{appt.phone || '---'}</td>
                  <td className="px-6 py-4">{appt.email}</td>
                  <td className="px-6 py-4">{appt.notes || '---'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold
                        ${appt.status === 'Confirmed' ? 'bg-green-500'
                        : appt.status === 'Cancelled' ? 'bg-red-500'
                        : 'bg-yellow-500'}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 flex">
                    <button
                      onClick={() => handleConfirm(appt.id)}
                      className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 gap-1"
                      title="Confirm Appointment"
                    >
                      <FaCheckCircle size={18} />
                      <span className="hidden sm:inline">Confirm</span>
                    </button>
                    <button
                      onClick={() => handleRejectClick(appt.id)}
                      className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 gap-1"
                      title="Reject Appointment"
                    >
                      <FaTimesCircle size={18} />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
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
