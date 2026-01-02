"use client"
import React ,{useState} from 'react'
import Link from "next/link"
import {Input ,Button} from "@nextui-org/react";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const AddUserForm = () => {
  //handleSubmit Function

  // visibility of password
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className='h-[calc(100vh-4.5rem)] flex justify-center items-center '>
      <div className="w-[400px] flex flex-col h-[550px] items-center
      bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-50
      rounded-2xl p-4 drop-shadow-md">
        <div className=" text-center p-4 mb-2">
          <h1 className='text-[45px] '>Add User</h1>
        </div>
          <form className='flex flex-col w-full gap-2 items-center mb-8' onSubmit=''>
            <Input size='sm' type="text" label="User Name" className="max-w-xs"/>
            <Input size='sm' type="email" label="Email" className="max-w-xs"/>
            <Input size='sm' type="tel" label="Phone Number" className="max-w-xs"/>
            <Input
                    label="Password"
                    size='sm'
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <VisibilityOffOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <VisibilityOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="max-w-xs"
                  />
                  <Button type="submit" color="primary">
                      Add User
                  </Button>

        </form>
      </div>
    </div>
  )
}

export default AddUserForm
