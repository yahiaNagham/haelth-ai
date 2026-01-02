"use client"
import React ,{FormEvent} from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,Input} from "@nextui-org/react";
import AddIcon from '@mui/icons-material/Add';
import { useSession } from "next-auth/react";
import { toast } from 'sonner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AddImeiDeviceModal() {

  const { data: session, status } = useSession();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  //handleSubmit Function
  const handleAddImei = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission
    const formData = new FormData(event.currentTarget)
    const userId = session?.user.id;
    try {
      const response = await fetch(`../api/device/${userId}`,
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imei: formData.get('imei'),
            car:formData.get('car')
          })
      })

      if (response.ok) {
        // Handle successful response and delete from ui table
        console.log("Successfully Adding");
        toast('Successfully Adding Imei Device', {
          className: 'bg-green-300',
          duration: 5000,
          position: 'bottom-right',
          status:'success',
          icon: <CheckCircleIcon />,
        });
        
      } else {
        // Handle error response
        console.error('Failed to Add Imei:', response.statusText)
        toast('Faild Adding Imei Device', {
          className: 'bg-red-300',
          description:"Device Already Added",
          duration: 5000,
          position: 'bottom-right',
          status:'success',
          icon: <CancelIcon />,
        });
      }
    } catch (error) {
      console.error('Error Add Imei:', error)
    }
  }



  return (
    <>
      <Button onPress={onOpen} className='bg-blue-500 text-gray-200  h-[35px] min-w-[35px] p-2 flex justify-center items-center'>
        <p>Add New Device</p>
        
        <AddIcon/>
      </Button>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Device
              </ModalHeader>
              <form onSubmit={handleAddImei}>
              <ModalBody>
                 
                  <Input size='sm' name='imei' 
                 type="text" label="Imei" className="max-w-xs" />
                  
                  <Input size='sm' name='car'  
                  type="text" label="Car" className="max-w-xs" />
 
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
  )
}


