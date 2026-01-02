"use client";
import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // مغلق افتراضيًا

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <CssBaseline />
      <Header toggleSidebar={toggleSidebar} />
      <SideBar open={sidebarOpen} />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          marginTop: '20px',
          transition: 'margin-left 0.3s ease',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Box>
    </Box>
  );
}