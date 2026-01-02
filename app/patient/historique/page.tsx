"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HistoryPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'appointments'>('notifications'); // الجديد: متغير للتحكم

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchData = async () => {
        try {
          const [notifRes, appointRes] = await Promise.all([
            fetch(`/api/notification?userId=${session.user.id}`),
            fetch(`/api/historique/appointments?userId=${session.user.id}`)
          ]);

          const notifData = await notifRes.json();
          const appointData = await appointRes.json();

          setNotifications(notifData.notifications || []);
          setAppointments(appointData || []);
        } catch (error) {
          console.error("Error fetching history data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status, session]);

  const handleDeleteAppointment = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/appointment/${id}`, { method: "DELETE" });

      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      } else {
        console.error("Failed to delete appointment.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-2xl font-semibold animate-pulse text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === 'appointments'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Appointments
        </button>
      </div>

      {/* Content */}
      {activeTab === 'notifications' && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-4">
             Notifications
          </h2>
          {notifications.length > 0 ? (
            <div className="grid gap-6">
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800 text-lg">{notif.message}</p>

                    {notif.fileLink && (
                      <div className="flex gap-4">
                        {/* View file */}
                        <a
                          href={notif.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors text-sm font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </a>

                        {/* Download file */}
                        <a
                          href={notif.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                          </svg>
                          Download
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mt-3">
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleDateString('en-GB')
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No notifications found.</p>
          )}
        </section>
      )}

      {activeTab === 'appointments' && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-4">
            Your Appointments
          </h2>
          {appointments.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl shadow-md bg-white">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-blue-100 text-blue-800 uppercase text-xs">
                    <th className="py-4 px-6 text-left">First Name</th>
                    <th className="py-4 px-6 text-left">Last Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Phone</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Time</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appoint) => (
                    <tr key={appoint.id} className="border-b hover:bg-gray-100 transition-colors">
                      <td className="py-4 px-6">{appoint.familyFname}</td>
                      <td className="py-4 px-6">{appoint.familyLname}</td>
                      <td className="py-4 px-6">{appoint.email}</td>
                      <td className="py-4 px-6">{appoint.phone}</td>
                      <td className="py-4 px-6">
                        {appoint.date
                          ? new Date(appoint.date).toLocaleDateString('en-GB')
                          : ''}
                      </td>
                      <td className="py-4 px-6">
                        {appoint.time
                          ? new Date(appoint.time).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </td>
                      <td className="py-4 px-6 text-center space-x-2">
                        <Link href={`/patient/appointment?id=${appoint.id}`}>
                          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-xs">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteAppointment(appoint.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No appointments found.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default HistoryPage;
