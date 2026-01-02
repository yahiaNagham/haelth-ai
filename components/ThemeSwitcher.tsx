// app/components/ThemeSwitcher.tsx
"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
      {
        theme === "light"?
        <Tooltip content='Dark Mode' className="text-blue-800"><DarkModeTwoToneIcon  onClick={() => setTheme('dark')} /></Tooltip>:
        <Tooltip content='Light Mode' ><LightModeTwoToneIcon onClick={() => setTheme('light')} /></Tooltip>
      }
      
    </div>
  )
};