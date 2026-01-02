"use client";

import Footer from "../../../components/Footer";
import styles from "../servic/page.module.css";
import {
  FaCalendarCheck,
  FaFileDownload,
  FaHospitalAlt,
  FaEdit,
  FaUsers,
  FaHistory,
} from "react-icons/fa";

const services = [
  {
    icon: <FaCalendarCheck className={styles["service-icon"]} />,
    title: "Online Appointment Booking for a Scan at the Laboratory",
    text: "Allows users to book an appointment directly on the website, choose the date, time, and type of scan. An interactive calendar can be used for this feature.",
  },
  {
    icon: <FaFileDownload className={styles["service-icon"]} />,
    title: "Download Scans via AI",
    text: "After the scan is performed, the AI analyzes the results and generates a detailed report. This report can be downloaded by the user from their personal account.",
  },
  {
    icon: <FaHospitalAlt className={styles["service-icon"]} />,
    title: "Access to Scans from Other Laboratories",
    text: "Users can upload scans performed elsewhere and submit them for AI analysis. The user pays for this service and receives a detailed report.",
  },
  {
    icon: <FaEdit className={styles["service-icon"]} />,
    title: "Appointment Modifications",
    text: "Users can change the time or date of their appointment based on the lab’s availability. The system sends an instant confirmation.",
  },
  {
    icon: <FaUsers className={styles["service-icon"]} />,
    title: "Managing Appointments for Oneself and Others",
    text: "The user can manage appointments for themselves or others (family, friends, etc.) with full control and notification system.",
  },
  {
    icon: <FaHistory className={styles["service-icon"]} />,
    title: "Personal Space for Result History",
    text: "A section where users can view and download all previous scan results and track their health progress.",
  },
];


const OurServices = () => {
  return (
    <>
      <div className={styles["services-container"]}>
        <div className={styles["services-header"]}>
          <h1 className={styles["services-title"]}>
            <span style={{ color: "#0071FF" }}>Our</span> Services
          </h1>
        </div>

        <div className={styles["services-grid"]}>
          {services.map((service, index) => (
            <div key={index} className={styles["service-card"]}>
              {service.icon}
              <h2 className={styles["service-card-title"]}>{service.title}</h2>
              <p className={styles["service-card-text"]}>{service.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurServices;
