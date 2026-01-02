"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../appointment/page.module.css";
import Footer from "../../../components/Footer";

const AppointmentForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");

  const [formData, setFormData] = useState({
    familyFname: "",
    familyLname: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const allTimes = [
    "08:00", "08:30", "09:00", "09:30", "10:00",
    "10:30", "11:00", "11:30", "12:00", "12:30",
    "14:00", "14:30", "15:00", "15:30", "16:00",
  ];

  // ✅ جلب بيانات الموعد الحالي لو id موجود
  useEffect(() => {
    const fetchAppointment = async () => {
      if (appointmentId) {
        try {
          const res = await fetch(`/api/appointment/${appointmentId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              familyFname: data.familyFname || "",
              familyLname: data.familyLname || "",
              email: data.email || "",
              phone: data.phone || "",
              date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
              time: data.time ? new Date(data.time).toISOString().substring(11, 16) : "", // ✅ فقط الوقت بدون تاريخ
            });
          }
        } catch (error) {
          console.error("Failed to fetch appointment:", error);
        }
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  // ✅ تعمير الإيميل والتليفون لو كان تسجيل دخول
  useEffect(() => {
    if (status === "authenticated" && session?.user && !appointmentId) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || "",
        phone: session.user.phone || "",
      }));
    }
    if (status === "unauthenticated") {
      setMessage("Please log in to book an appointment.");
      setTimeout(() => router.push("/login"), 2000);
    }
  }, [status, session, router, appointmentId]);

  // ✅ جلب جميع المواعيد
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointment');
        const data = await res.json();
        setBookedAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };
    fetchAppointments();
  }, []);

  // ✅ تحديد الأوقات المتاحة
  useEffect(() => {
    if (formData.date) {
      const bookedTimes = bookedAppointments
        .filter(appointment =>
          appointment.date === formData.date &&
          appointment.id !== parseInt(appointmentId || "0")
        )
        .map(appointment => appointment.time ? new Date(appointment.time).toISOString().substring(11, 16) : "")


      let available = allTimes.filter(time => !bookedTimes.includes(time));

      // ✅ نزيد الوقت القديم لو مش موجود
      if (formData.time && !available.includes(formData.time)) {
        available = [formData.time, ...available];
      }

      setAvailableTimes(available);
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, formData.time, bookedAppointments, appointmentId]);

  // ✅ handle inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ إرسال الفورم
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email) {
      setMessage("Email is required.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    // تحقق أن الوقت موجود فـ allTimes
    if (!allTimes.includes(formData.time)) {
      setMessage("Invalid time selected. Please choose a valid time.");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    // تحقق أن الوقت مش محجوز
    const isTimeTaken = bookedAppointments.some(appointment =>
      appointment.date === formData.date &&
      new Date(appointment.time).toISOString().substring(11, 16) === formData.time
 &&
      appointment.id !== parseInt(appointmentId || "0")
    );

    if (isTimeTaken) {
      setMessage("The selected time is already booked. Please choose another time.");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const url = appointmentId ? `/api/appointment/${appointmentId}` : "/api/appointment";
      const method = appointmentId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: session?.user?.id ? parseInt(session.user.id) : null,
          familyFname: formData.familyFname || null,
          familyLname: formData.familyLname || null,
          email: formData.email,
          phone: formData.phone || null,
          date: formData.date || null,
          time: formData.time || null,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage(appointmentId ? "Appointment updated successfully!" : "Appointment booked successfully! Waiting for confirmation.");
        setIsSuccess(true);
        if (!appointmentId) {
          setFormData({
            familyFname: "",
            familyLname: "",
            email: session?.user?.email || "",
            phone: session?.user?.phone || "",
            date: "",
            time: "",
          });
        } else {
          setTimeout(() => {
            router.push("/patient/historique");
          }, 1000);
        }
      } else {
        setMessage(`Failed: ${data.message}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error booking/updating appointment:", error);
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <h1 className={styles.h1}>
              {appointmentId ? "Edit Appointment" : "Book Appointment"}
            </h1>
            <div className={styles.subtitle}>
              {appointmentId ? "Edit your appointment details." : "Book an Appointment for Your Family"}
            </div>
            <p className={styles.description}>
              Our Health Ai+ platform allows you to {appointmentId ? "edit" : "book"} appointments easily.
            </p>
            <div className={styles.phoneNumber}>
              Or call us at <a href="tel:+213726250400">+213 726 25 04 00</a>
            </div>
          </div>

          <div className={styles.rightSection}>
            <h2 className={styles.formTitle}>
              {appointmentId ? "Edit Appointment" : "Book an Appointment"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Full Name */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    className={styles.input}
                    type="text"
                    name="familyFname"
                    placeholder="First Name"
                    value={formData.familyFname}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <input
                    className={styles.input}
                    type="text"
                    name="familyLname"
                    placeholder="Last Name"
                    value={formData.familyLname}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              {/* Phone */}
              <div className={styles.formGroup}>
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Date and Time */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <input
                    className={styles.input}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <select
                    className={styles.input}
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    disabled={loading || !formData.date}
                    required
                  >
                    <option value="">Select Time</option>

                    {/* عرض الوقت الحالي لو مش موجود */}
                    {formData.time && !availableTimes.includes(formData.time) && (
                      <option value={formData.time}>{formData.time}</option>
                    )}

                    {/* عرض الأوقات المتاحة */}
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600 hover:scale-105 hover:shadow-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : appointmentId ? "Save Changes" : "Book Appointment"}
              </button>

              {/* Message */}
              {message && (
                <p
                  className={`text-center mt-4 ${
                    isSuccess ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AppointmentForm;
