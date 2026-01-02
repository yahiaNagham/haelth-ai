"use client";
import { useState } from "react";

export default function AdminForm() {
    const [formData, setFormData] = useState({
        Firstname: "",
        Lastname: "",
        Email: "",
        Password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("/api/addadmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Admin added successfully!");
                setFormData({ Firstname: "", Lastname: "", Email: "", Password: "" });
            } else {
                setMessage(data.message || "Error adding admin");
            }
        } catch (error: unknown) {
          if (error instanceof Error) {
              setMessage(error.message);
          } else {
              setMessage("An unknown error occurred.");
          }
      }
      
      
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Admin</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Firstname"
                    placeholder="Firstname"
                    value={formData.Firstname}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                <input
                    type="text"
                    name="Lastname"
                    placeholder="Lastname"
                    value={formData.Lastname}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                <input
                    type="password"
                    name="Password"
                    placeholder="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    className="w-full mb-2 p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Add Admin
                </button>
            </form>
        </div>
    );
}
