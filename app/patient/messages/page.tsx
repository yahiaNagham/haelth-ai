"use client";
import { useEffect, useState } from "react";

export default function UserMessages() {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState(""); // البريد تاع المستخدم
  const [loading, setLoading] = useState(false); // للتحقق من حالة التحميل
  const [error, setError] = useState<string | null>(null); // لتخزين الأخطاء

  const fetchMessages = async () => {
    if (!email) return;

    setLoading(true); // عند بدء التحميل
    setError(null); // مسح الأخطاء السابقة

    try {
      const res = await fetch(`/api/my-messages?email=${email}`);
      if (!res.ok) {
        throw new Error("حدث خطأ أثناء جلب الرسائل.");
      }
      const data = await res.json();
      setMessages(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false); // إيقاف التحميل بعد انتهاء العملية
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📨 رسائلي</h2>

      {!email ? (
        <div>
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            onChange={handleEmailChange}
            value={email}
          />
          <button onClick={fetchMessages} disabled={loading}>
            {loading ? "جاري التحميل..." : "عرض الرسائل"}
          </button>
        </div>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {messages.length === 0 ? (
            <p>لا توجد رسائل أو لم يتم الرد بعد.</p>
          ) : (
            messages.map((msg: any) => (
              <div key={msg.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <h3>{msg.subject}</h3>
                <p>{msg.message}</p>
                {msg.reply ? (
                  <p style={{ color: "green" }}>
                    <strong>رد الإدارة:</strong> {msg.reply.response}
                  </p>
                ) : (
                  <p>⏳ في انتظار الرد من الإدارة</p>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
