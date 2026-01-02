'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownItem,
  Dropdown,
  DropdownMenu,
  Avatar,
  DropdownTrigger,
  Badge
} from "@nextui-org/react";
import { BellIcon } from 'lucide-react';
import { ThemeSwitcher } from "./ThemeSwitcher";
import LogOut from './LogOut';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user?.id) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/notification?userId=${session.user.id}`);
          const data = await res.json();
          setNotifications(data.notifications || []);
          setNotificationCount(data.notifications?.length || 0);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const navLinks = [
    { label: "Home", href: "/" },
    
    { label: "Services", href: "/patient/servic" },
    { label: "Contact", href: "/contact" },
    { label: "Appointments", href: "/patient/appointment" },
  ];

  return (
    <nav className="bg-white dark:bg-blue-950 shadow-lg text-black dark:text-white sticky top-0 z-50">
      <div className="w-full px-0">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" style={{ display: "block" }}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <h1 style={{
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#2563eb",
      lineHeight: 1,
      margin: 0
    }}>
      Health
      <span style={{
        color: "#1e40af",
      }}>
        AI
        <span style={{
          marginLeft: "0.25rem",
          verticalAlign: "super",
          fontSize: "1.25rem",
          fontWeight: 800
        }}>+</span>
      </span>
    </h1>
  </div>
</Link>





          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="relative group font-bold px-3 py-2 transition-colors duration-300"
                >
                  <span className="relative z-10 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {label}
                  </span>
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-blue-500 dark:bg-blue-300 transition-all duration-300 ease-in-out group-hover:w-[70%] -translate-x-1/2 rounded-full"></span>
                </Link>
              ))}
            </div>

            <ThemeSwitcher />

            {status === "authenticated" ? (
              <div className="flex items-center gap-4">
                <Dropdown placement="bottom-end" className="bg-white dark:bg-blue-900 text-blue-800 dark:text-gray-200 rounded-xl shadow-2xl w-80">
                  <DropdownTrigger>
                    <Badge 
                      content={notificationCount > 0 ? notificationCount : null}
                      color="danger"
                      shape="circle"
                      className="cursor-pointer"
                    >
                      <button 
                        className="text-gray-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 relative"
                        aria-label="Notifications"
                      >
                        <BellIcon size={26} />
                        {isLoading && (
                          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                        )}
                      </button>
                    </Badge>
                  </DropdownTrigger>
                  
                  <DropdownMenu 
                    aria-label="Notifications" 
                    variant="flat" 
                    className="p-0 border-t-2 border-gray-200 dark:border-gray-700 max-h-[350px] overflow-y-auto"
                  >
                    <DropdownItem
                      key="title"
                      isReadOnly
                      className="px-6 py-4 block cursor-default"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-base font-semibold text-blue-800 dark:text-blue-300">
                          Notifications
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`/api/notification/read-all?userId=${session?.user?.id}`, {
                                method: 'PATCH',
                              });
                              setNotifications([]);
                              setNotificationCount(0);
                            } catch (err) {
                              console.error('Failed to mark all as read:', err);
                            }
                          }}
                          className="text-xs text-blue-600 hover:font-bold hover:text-blue-900 font-medium transition duration-200"
                        >
                           Mark all as read
                        </button>
                      </div>
                    </DropdownItem>

                    {isLoading ? (
                      <DropdownItem key="loading" className="text-center py-4">
                        <span className="text-gray-500">Loading notifications...</span>
                      </DropdownItem>
                    ) : notifications.length > 0 ? (
                      notifications.map((notif, index) => (
                        <DropdownItem 
                          key={index} 
                          className="py-5 px-6 hover:bg-blue-50 dark:hover:bg-blue-800 border-b border-gray-100 dark:border-gray-700 max-w-full break-words"
                        >
                          <div className="flex flex-col items-start text-right gap-2">
                            {typeof notif === "object" && 'message' in notif ? (
                              notif.fileLink ? (
                                <>
                                  <a
                                    href={notif.fileLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                   className=" text-sm font-medium text-black dark:text-blue-300 break-words whitespace-pre-wrap hover:font-bold hover:text-blue-800 transition-all duration-200 leading-relaxed"
                                    >
                                     {notif.message}
                                  </a>
                                  <div className="flex items-center gap-2 text-xs mt-1">
                                    <a
                                      href={notif.fileLink}
                                      download
                                      className="text-green-600 hover:text-green-700 hover:font-bold"
                                    >
                                      ⬇️ Download file
                                    </a>
                                  
                                  </div>
                                </>
                              ) : (
                            <span className="text-sm text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap text-left w-full">
                             {notif.message}
                              </span>
                              )
                            ) : (
                              <span className="text-red-500 text-sm">❌ Notification error</span>
                            )}
                            <span className="text-xs text-gray-500 mt-1 self-end">
                              {notif.createdAt
                                ? new Date(notif.createdAt).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </DropdownItem>
                      ))
                    ) : (
                      <DropdownItem 
                        key="no-notifications" 
                        className="text-sm italic text-gray-500 px-4 py-4 text-center"
                      >
                        No notifications available
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown placement="bottom-end" className="bg-white dark:bg-blue-900 text-blue-800 dark:text-gray-200 rounded-lg shadow-lg">
                  <DropdownTrigger>
                    <Avatar
                      isBordered
                      as="button"
                      className="w-11 h-11 border-2 border-blue-500 transition-transform hover:scale-105"
                      name={session?.user?.name || "User"}
                      src={session?.user?.image || "/user.jpg"}
                    />
                  </DropdownTrigger>

                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="hover:bg-blue-600 hover:text-white transition-all duration-200 p-4">
                      <div className="flex flex-col">
                        <p className="font-semibold text-lg text-blue-800 dark:text-white">
                          <span className="font-bold uppercase">{session?.user?.role}:</span> {session?.user?.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{session?.user?.email}</p>
                      </div>
                    </DropdownItem>
                    <DropdownItem key="settings" className="hover:bg-blue-500 hover:text-white transition-all duration-200">
                      Account Settings
                    </DropdownItem>
                    <DropdownItem key="help_and_feedback" className="hover:bg-blue-500 hover:text-white transition-all duration-200">
                      Help & Feedback
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" className="hover:bg-red-600 hover:text-white transition-all duration-200">
                      <LogOut />
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn bg-blue-600 text-white font-semibold rounded-xl px-5 py-2.5 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-[#135BA1] hover:to-[#1A76D1]"
                aria-label="Login or Sign In"
              >
                Login / Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
