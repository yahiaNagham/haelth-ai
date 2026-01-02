"use client";

import React, { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Avatar,
} from "@mui/material";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/appointment/pending");
      const data = await res.json();
      setCount(data.count);
      const formattedNotifications = data.notifications.map((notif: any) => ({
        ...notif,
        user: `${notif.familyFname} ${notif.familyLname}`,
        action: "has scheduled a new appointment",
        unread: true,
        avatar: "https://example.com/avatar.jpg", // Replace with actual avatar URL if needed
      }));
      setNotifications(formattedNotifications || []);
    } catch (err) {
      console.error("Error fetching pending appointments", err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, unread: false })));
    setCount(0);
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <Badge badgeContent={count} color="error">
          <IoNotificationsOutline size={24} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 400,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            maxHeight: "60vh",
            overflowY: "auto",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1a1a1a", fontSize: "1rem" }}
            >
              Notifications
            </Typography>
            <Badge
              badgeContent={count}
              color="primary"
              sx={{
                marginLeft: 1,
                "& .MuiBadge-badge": {
                  backgroundColor: "#0a317b",
                  color: "#fff",
                  fontSize: "11px",
                  height: "18px",
                  minWidth: "18px",
                  borderRadius: "9px",
                },
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "#5e6778",
              cursor: "pointer",
              fontSize: "0.8rem",
              "&:hover": { color: "#0a317b", textDecoration: "underline" },
            }}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Typography>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <MenuItem disabled sx={{ textAlign: "center", padding: "14px" }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem" }}>
              No pending appointments
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <div key={index}>
              <MenuItem
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "6px 12px",
                  minHeight: "auto",
                  backgroundColor: notification.unread ? "#f7fafd" : "#fff",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                  whiteSpace: "normal",
                }}
              >
                <Avatar
                  src={notification.avatar}
                  sx={{ width: 32, height: 32, marginRight: 1.5 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#1a1a1a", lineHeight: 1.3, fontSize: "0.8rem" }}
                  >
                    <strong>{notification.user}</strong> {notification.action}
                    {notification.unread && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          backgroundColor: "#f65314",
                          borderRadius: "50%",
                          marginLeft: 4,
                        }}
                      />
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#5e6778", fontSize: "0.75rem", marginTop: "2px" }}
                  >
                    {notification.email}
                  </Typography>

                  <a
                    href={`/appointments/${notification.id}`}
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      fontWeight: "bold",
                      display: "inline-block",
                      fontSize: "0.75rem",
                      marginTop: "2px",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    Please check the appointment: [Accept or Reject Link]
                  </a>
                </Box>
              </MenuItem>
              {index < notifications.length - 1 && (
                <Divider sx={{ margin: "0 12px" }} />
              )}
            </div>
          ))
        )}
      </Menu>
    </>
  );
}
