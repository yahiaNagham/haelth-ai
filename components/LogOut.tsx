"use client"

import { signOut } from "next-auth/react"

const LogOut = () => {
  return (
    <div onClick={() => signOut({
      redirect:true,
      callbackUrl:`${window.location.origin}`
    })}>
Log Out
    </div>
  )
}

export default LogOut
