"use client"
import React,{FormEvent} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,Input} from "@nextui-org/react";
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function AddUserModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleAddUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission
    const formData = new FormData(event.currentTarget)
    
    try {
      const response = await fetch(`../api/user`,
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            full_name: formData.get('username'),
            email:formData.get('email'),
            phone_number:formData.get('phone'),
            password:formData.get('password')
          })
      })

      if (response.ok) {
        // Handle successful response and delete from ui table
        console.log("Successfully Adding");
        
      } else {
        // Handle error response
        console.error('Failed to Add User:', response.statusText)
      }
    } catch (error) {
      console.error('Error Add User:', error)
    }
  }

  return (
    <>
      <Button onPress={onOpen} className='bg-blue-500 text-gray-200 block h-[35px] min-w-[35px] p-2 flex justify-center items-center'>
        <p>Add New User</p>
        
        <AddIcon/>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New User
              </ModalHeader>
              <form onSubmit={handleAddUser}>
              <ModalBody>
                 
                  <Input size='sm' name='username' 
                 type="text" label="User Name" className="max-w-xs"/>
                  
                  <Input size='sm' name='email'  
                  type="email" label="Email" className="max-w-xs"/>

                  <Input size='sm' name='phone'  
                  type="tel" label="Phone Number" className="max-w-xs"/>
                  
                  <Input
                          label="Password"
                          name='password' 
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type='submit' onPress={onClose}>
                  Add
                </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
