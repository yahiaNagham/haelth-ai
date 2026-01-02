"use client";
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  MdDashboard,
  MdPeople,
  MdCalendarToday,
  MdSettings,
  MdExitToApp,
} from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaFileMedical } from "react-icons/fa";
import Link from "next/link";
import LogOut from "./LogOut";

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const menuItems = [
    {
      text: "Dashboard",
      icon: <MdDashboard size={20} />,
      link: "/admin/dashboard",
      color: "rgb(228, 216, 77)",
    },
    {
      text: "Check Patients List",
      icon: <MdPeople size={20} />,
      link: "/admin/listepatient",
      color: "#a280e9",
    },
    {
      text: "Add Patient",
      icon: <IoMdAddCircleOutline size={20} />,
      link: "/admin/addpatient",
      color: "#43A047",
    },
    {
      text: "Appointments",
      icon: <MdCalendarToday size={20} />,
      link: "/admin/appointment",
      color: "#D81B60",
    },
    {
      text: "Post Scans Results",
      icon: <FaFileMedical size={20} />,
      link: "/admin/postscan",
      color: "#29B6F6",
    },
    {
      text: "Payments ",
      icon: <FaMoneyCheckDollar size={20} />,
      link: "/add-doctor",
      color: "#FB8C00",
    },
    {
      text: "Settings",
      icon: <MdSettings size={20} />,
      link: "/settings",
      color: "#546E7A",
    },
    // Logout removed from here
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 72,
          transition: "width 0.3s ease",
          overflowX: "hidden",
          backgroundColor: "white",
          borderRight: "1px solid #e0e0e0",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", py: 1 }}>
        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ px: 1, my: 0.5 }}>
                <Link
                  href={item.link}
                  passHref
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <Tooltip
                    title={item.text}
                    placement="right"
                    disableHoverListener={open}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        borderRadius: "6px",
                        "&:hover": {
                          backgroundColor: "#1A76D1",
                          color: "white",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{ fontSize: "0.875rem" }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </Link>
              </ListItem>
              {(index === 3 || index === 5) && (
                <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.08)" }} />
              )}
            </React.Fragment>
          ))}

          {/* زر الخروج */}
          <ListItem disablePadding sx={{ px: 1, my: 0.5 }}>
            <Tooltip title="Logout" placement="right" disableHoverListener={open}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#1A76D1",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon
        sx={{
          minWidth: 0,
          mr: open ? 3 : "auto",
          justifyContent: "center",
          color: "#E53935", // لون أحمر مثلاً للخروج
        }}
      >
        <MdExitToApp size={20}/>
      </ListItemIcon>
      {open && <LogOut />}
    
              </ListItemButton>
            </Tooltip>
            
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
