"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("تم إرسال الرسالة بنجاح");
    } else {
      alert("حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input name="name" placeholder="الاسم" onChange={handleChange} required />
      <input name="email" type="email" placeholder="البريد الإلكتروني" onChange={handleChange} required />
      <input name="subject" placeholder="الموضوع" onChange={handleChange} required />
      <textarea name="message" placeholder="الرسالة" onChange={handleChange} required />
      <button type="submit">إرسال</button>
    </form>
  );
}
