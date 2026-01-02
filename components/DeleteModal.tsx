'use client'
import React, { FormEvent } from "react";
import { toast } from 'sonner';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
interface deleteModalProp {
  userId?:string,
  deviceId?:string
 deleteUser?:(userId: string) => void
 deleteDevice?:(deviceId: string) => void
}
export default function DeleteModal({userId,deleteUser,deviceId,deleteDevice}:deleteModalProp) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const handleDeleteUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission

    try {
      const response = await fetch(userId?`../api/users/${userId}`:`../api/device/${deviceId}`,
        {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Handle successful response and delete from ui table
        userId ? deleteUser(userId) : deleteDevice(deviceId);
        toast(`Successfully Deleting ${userId ? 'User': 'Device'}`, {
          className: 'bg-green-300',
          duration: 5000,
          position: 'bottom-right',
          status:'success',
          icon: <CheckCircleIcon />,
        });
                
      } else {
        console.error('Failed to delete user:', response.statusText)
        toast('Faild deleted', {
          className: 'bg-red-300',
          description:"something went wrong",
          duration: 5000,
          position: 'bottom-right',
          status:'success',
          icon: <CancelIcon />,
        });
            
      }
    } catch (error) {
      console.error('Error deleting', error)
    }
  }

  return (
    <>
      <Button onPress={onOpen} className='bg-red-500 text-gray-200 block h-[35px] min-w-[35px] p-0'><DeleteOutlinedIcon/></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete {userId? `user ${userId}`:`device imei ${deviceId}`} </ModalHeader>
              <form onSubmit={handleDeleteUser}>
              <input type="hidden" name="userId" value={userId}/>
              <input type="hidden" name="userId" value={deviceId}/>
              <ModalBody>
                <p> 
                  are you sure! do you want delete {userId? ` this user : ${userId}`:`this device imei : ${deviceId}`}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type='submit' onPress={onClose}>
                  Delete
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
