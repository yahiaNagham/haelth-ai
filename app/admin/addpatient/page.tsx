"use client";

import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import styles from "../addpatient/page.module.css";
import { FaUser, FaEnvelope, FaLock, FaVenusMars } from "react-icons/fa";



const AddPatientForm = () => {
  const [formData, setFormData] = useState({
    Firstname: "",
    Lastname: "",
    DateOfBirth: "",
    Email: "",
    Password: "",
    Gender: "Male",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/addpatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Patient added successfully!");
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (error) {
      alert("⚠️ An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Add New Patient 🩺</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                required
              />
              <span className={styles.icon}><FaUser /></span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="Lastname"
                value={formData.Lastname}
                onChange={handleChange}
                required
              />
              <span className={styles.icon}><FaUser /></span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <div className={styles.inputContainer}>
              <input
                type="date"
                name="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleChange}
                required
              />
              <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.6);
          cursor: pointer; 
          position: absolute;
       right: 12px; }
      `}</style>
            
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
              <span className={styles.icon}><FaEnvelope /></span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputContainer}>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
              <span className={styles.icon}><FaLock /></span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            <div className={styles.inputContainer}>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <span className={styles.icon}><FaVenusMars /></span>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>Add Patient</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddPatientForm;
