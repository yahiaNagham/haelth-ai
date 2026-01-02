"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import styles from "./page.module.css";
import { FaEnvelope, FaLock, FaUser, FaCalendar } from "react-icons/fa";



interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: "Male" | "Female"; // Updated to match Prisma enum
}

const AuthPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "Male", // Default to match enum
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const redirectPath = session.user.role === "admin" ? "/admin/dashboard" : "/patient";
      router.push(redirectPath);
    }
  }, [status, session, router]);

  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signup form input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });

      if (result?.error) {
        setErrorMessage("Login failed: Invalid email or password.");
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
      setLoading(false);
    }
  };

  // Handle signup submission
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Client-side validation
    if (!registerData.first_name || !registerData.last_name || !registerData.email || !registerData.password) {
      setErrorMessage("First name, last name, email, and password are required.");
      setLoading(false);
      return;
    }
    if (registerData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const payload = {
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      email: registerData.email,
      password: registerData.password,
      dateOfBirth: registerData.dateOfBirth || null,
      gender: registerData.gender || null,
      accountType: "Standard",
      phone: null,
      address: null,
      location: null,
    };

    console.log("Sending payload to /api/patient:", payload);

    try {
      const response = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setLoading(false);

      if (response.ok) {
        setRegisterData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          gender: "Male",
        });
        setErrorMessage("");
        setSuccessMessage("Registration successful! Switching to login...");
        setTimeout(() => {
          setIsActive(false);
        }, 2000);
      } else {
        setErrorMessage(data.message || `Registration failed with status ${response.status}.`);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(`An error occurred: ${error.message || "Unknown error"}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={`${styles.container} ${isActive ? styles.active : ""}`}>
        {/* Login Form */}
        <div className={`${styles.formBox} ${styles.login}`}>
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            <div className={styles.inputBox}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={loginData.email}
                onChange={handleLoginChange}
                disabled={loading}
              />
              <span className={styles.icons}>
                <FaEnvelope />
              </span>
            </div>
            <div className={styles.inputBox}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={loading}
              />
              <span className={styles.icons}>
                <FaLock />
              </span>
            </div>
            <div className={styles.forgot}>
              <a href="#">Forgot password?</a>
            </div>
            {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Registration Form */}
        <div className={`${styles.formBox} ${styles.register}`}>
          <form className={styles.form} onSubmit={handleRegisterSubmit}>
            <h1 className={styles.registerName}>Sign In</h1>
            {/* First & Last Name */}
            <div className={styles.name}>
              <div className={styles.inputBox2}>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  required
                  value={registerData.first_name}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
                <span className={styles.icons}>
                  <FaUser />
                </span>
              </div>
              <div className={styles.inputBox2}>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  required
                  value={registerData.last_name}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
                <span className={styles.icons}>
                  <FaUser />
                </span>
              </div>
            </div>

            {/* Birthday */}
            <div className={`${styles.inputBox2} ${styles.birthdayBox}`}>
              <label htmlFor="birthday">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="dateOfBirth"
                required
                value={registerData.dateOfBirth}
                onChange={handleRegisterChange}
                disabled={loading}
              />
              <style jsx>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                  filter: invert(0.6);
                  cursor: pointer;
                }
              `}</style>
            </div>

            {/* Gender */}
            <div className={styles.genderBox}>
              <label className={styles.label}>Gender :</label>
              <div className={styles.genderOptions}>
                <label htmlFor="male">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male" // Updated to match enum
                    required
                    checked={registerData.gender === "Male"}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                  Male
                </label>
                <label htmlFor="female">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female" // Updated to match enum
                    required
                    checked={registerData.gender === "Female"}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Email */}
            <div className={styles.inputBox2}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={registerData.email}
                onChange={handleRegisterChange}
                disabled={loading}
              />
              <span className={styles.icons}>
                <FaEnvelope />
              </span>
            </div>

            {/* Password */}
            <div className={styles.inputBox2}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={registerData.password}
                onChange={handleRegisterChange}
                disabled={loading}
              />
              <span className={styles.icons}>
                <FaLock />
              </span>
            </div>

            {/* Confirm Password */}
            <div className={styles.inputBox2}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                disabled={loading}
              />
              <span className={styles.icons}>
                <FaLock />
              </span>
            </div>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        {/* Toggle Box */}
        <div className={styles.toggleBox}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>Welcome Back!</h1>
            <p>Don&apos;t have an account?</p>
            <button className={styles.btn} onClick={() => setIsActive(true)}>
              Register
            </button>
          </div>
          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>Hello, Welcome!</h1>
            <p>Already have an account?</p>
            <button className={styles.btn} onClick={() => setIsActive(false)}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;