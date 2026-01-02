import React from "react";
import { AppBar, Toolbar, IconButton, Typography, InputBase, Avatar, Box } from "@mui/material";
import { IoMenu, IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import NotificationBell from "../components/NotificationBell";


interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <AppBar 
      position="fixed"
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '64px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={toggleSidebar} 
            sx={{ mr: 2 }}
          >
            <IoMenu size={24} />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
            MedEx
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Bar */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            padding: '6px 12px',
            width: '250px'
          }}>
            <InputBase
              placeholder="Search..."
              sx={{ width: '100%' }}
            />
            <IoSearch style={{ marginRight: '8px', color: '#757575' }} size={25} />
          </Box>

          {/* Message Icon */}
          <IconButton>
            <FaRegMessage size={20} />
          </IconButton>

          {/* Notification Icon */}
          <NotificationBell />
          {/* Profile Avatar */}
          <IconButton>
            <Avatar 
              alt="User Avatar"
              src="/user.jpg" // Replace with the user's image URL or path
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
