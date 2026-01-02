'use client'
import React, { FormEvent } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import ArticleIcon from '@mui/icons-material/Article';
export default function ShowDetailsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  

  return (
    <>
      <Button onPress={onOpen} className='bg-green-500 text-gray-200 block h-[35px] min-w-[35px] p-0'>
        <ArticleIcon/></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Show Details {}</ModalHeader>
              <form onSubmit=''>
              <input type="hidden" name="userId" />
              <ModalBody>
                <p> 
                  Details
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type='submit' onPress={onClose}>
                  Exit
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
