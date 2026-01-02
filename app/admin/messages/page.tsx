"use client";
import { useEffect, useState } from "react";
import styles from '../messages/page.module.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [sent, setSent] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  const handleReply = async (messageId: number) => {
    const response = replies[messageId];
    if (!response) return;

    const res = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, response }),
    });

    if (res.ok) {
      setSent((prev) => ({ ...prev, [messageId]: true }));
    }
  };

  return (
    <div className={styles.container}>
      <h2>📨 </h2>
      {messages.length === 0 ? (
        <p>           No messages at the moment.    </p>
      ) : (
        messages.map((msg: any) => (
          <div key={msg.id} className={styles.messageCard}>
            <h3>{msg.subject}</h3>
            <p><strong>{msg.name}</strong> - {msg.email}</p>
            <p>{msg.message}</p>

            {sent[msg.id] ? (
              <p className={styles.sent}>✅ Message sent successfully.</p>
            ) : (
              <>
                <textarea
                  placeholder="Write the reply here....."
                  value={replies[msg.id] || ""}
                  onChange={(e) =>
                    setReplies({ ...replies, [msg.id]: e.target.value })
                  }
                  className={styles.textarea}
                />
                <button
                  onClick={() => handleReply(msg.id)}
                  className={styles.button}
                >
                Send the reply
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
