"use client";
import { useEffect, useState } from 'react';
import { FaUserAlt, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { IoArrowUpCircleSharp, IoArrowDownCircleSharp } from 'react-icons/io5';
import { MdOutlineAttachMoney,MdBiotech } from "react-icons/md";

import AdminLayout from "../AdminLayout";
import styles from '../dashboard/page.module.css';



export default function DashboardPage() {
  const [patientStats, setPatientStats] = useState({
    total: 0,
    up: 0,
    down: 0,
    percentage: '0',
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        setPatientStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
  
    fetchStats();
  }, []);
  


  return (
    <AdminLayout>
      <div className={styles.mainContent}>
        <div className={styles.overview}>
          <div className={styles.title}>
            <h2 className={styles.sectionTitle}>Overview</h2>
          </div>

          <div className={styles.cards}>
            {/* Doctors Card */}
            <div className={`${styles.card} ${styles.card1}`}>
              <div className={styles.cardData}>
                <div className={styles.cardContent}>
                  <h5 className={styles.cardTitle}>AI Predictions</h5>
                  <h1>0</h1>
                </div>
                <MdBiotech className={styles.cardIconLg} />
              </div>
              <div className={styles.cardStats}>
                <span><FaChartBar className={`${styles.cardIcon} ${styles.statIcon}`} />65%</span>
                <span><IoArrowUpCircleSharp className={`${styles.cardIcon} ${styles.upArrow}`} />10</span>
                <span><IoArrowDownCircleSharp className={`${styles.cardIcon} ${styles.downArrow}`} />2</span>
              </div>
            </div>

            {/* Patients Card */}
            <div className={`${styles.card} ${styles.card2}`}>
              <div className={styles.cardData}>
                <div className={styles.cardContent}>
                  <h5 className={styles.cardTitle}>Total Patients</h5>
                  <h1>{patientStats.total}</h1>
                </div>
                <FaUserAlt className={styles.cardIconLg} />
              </div>
              <div className={styles.cardStats}>
                <span><FaChartBar className={`${styles.cardIcon} ${styles.statIcon}`} /> {patientStats.percentage}%</span>
                <span><IoArrowUpCircleSharp className={`${styles.cardIcon} ${styles.upArrow}`} />{patientStats.up}</span>
                <span><IoArrowDownCircleSharp className={`${styles.cardIcon} ${styles.downArrow}`} />{patientStats.down}</span>
              </div>
            </div>

            {/* Schedule Card */}
            <div className={`${styles.card} ${styles.card3}`}>
              <div className={styles.cardData}>
                <div className={styles.cardContent}>
                  <h5 className={styles.cardTitle}>Appointments</h5>
                  <h1>0</h1>
                </div>
                <FaCalendarAlt className={styles.cardIconLg} />
              </div>
              <div className={styles.cardStats}>
                <span><FaChartBar className={`${styles.cardIcon} ${styles.statIcon}`} />27%</span>
                <span><IoArrowUpCircleSharp className={`${styles.cardIcon} ${styles.upArrow}`} />31</span>
                <span><IoArrowDownCircleSharp className={`${styles.cardIcon} ${styles.downArrow}`} />23</span>
              </div>
            </div>

            {/* Payments Card */}
            <div className={`${styles.card} ${styles.card4}`}>
              <div className={styles.cardData}>
                <div className={styles.cardContent}>
                  <h5 className={styles.cardTitle}>Payments</h5>
                  <h1>0</h1>
                </div>
                <MdOutlineAttachMoney className={styles.cardIconLg} />
              </div>
              <div className={styles.cardStats}>
                <span><FaChartBar className={`${styles.cardIcon} ${styles.statIcon}`} />8%</span>
                <span><IoArrowUpCircleSharp className={`${styles.cardIcon} ${styles.upArrow}`} />11</span>
                <span><IoArrowDownCircleSharp className={`${styles.cardIcon} ${styles.downArrow}`} />2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
