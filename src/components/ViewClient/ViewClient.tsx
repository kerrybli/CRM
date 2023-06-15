import {
    Box, Button, Center, Drawer, DrawerBody,
    DrawerCloseButton, DrawerContent, DrawerFooter,
    DrawerHeader, DrawerOverlay, Flex, Image, Input, Radio, RadioGroup,
    SimpleGrid, Stack, Text, useDisclosure,
} from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { FormDataInterface } from '../../Interface/Interface';

import { LuSettings2 } from 'react-icons/lu'
import React from 'react';


export const ViewClient: FC = () => {
    const [clientDetails, setClientDetails] = useState<{ [key: string]: FormDataInterface }>({})
    const [allClientDetails, setAllClientDetails] = useState<{ [key: string]: FormDataInterface }>({})
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [value, setValue] = React.useState<string>('');
    const [filterDate, setFilterDate] = useState<string>('');





    const handleDelete = (id: string) => {
        const existingDataString = localStorage.getItem('formData');
        if (existingDataString) {
            const existingData = JSON.parse(existingDataString) as { [key: string]: FormDataInterface };
            delete existingData[id];
            localStorage.setItem('formData', JSON.stringify(existingData));
            setClientDetails(existingData);
        }
    };

    const handleStatusToggle = (id: string) => {
        const updatedClientDetails = { ...clientDetails };
        updatedClientDetails[id].status = updatedClientDetails[id].status === 'active' ? 'inactive' : 'active';
        setClientDetails(updatedClientDetails);
        localStorage.setItem('formData', JSON.stringify(updatedClientDetails));
    };




    const handleDrawerFilter = () => {
        let filteredData = Object.values(allClientDetails);

        if (value && filterDate) {
            filteredData = filteredData.filter(
                (client) =>
                    client.status === value &&
                    (client.date?.split('T')[0] ?? '') === filterDate
            );
        } else if (value) {
            filteredData = filteredData.filter(
                (client) => client.status === value
            );
        } else if (filterDate) {
            filteredData = filteredData.filter(
                (client) => (client.date?.split('T')[0] ?? '') === filterDate
            );
        }

        const filteredDataObject: { [key: string]: FormDataInterface } = {};
        filteredData.forEach((client) => {
            filteredDataObject[client.id as string] = client;
        });
        setClientDetails(filteredDataObject);

        onClose();
    };

    const handleReset = () => {
        setValue('');
        setFilterDate('');
        setClientDetails(allClientDetails);
        onClose();
    };

    useEffect(() => {
        const existingData = localStorage.getItem('formData');
        if (existingData) {
            const parsedData = JSON.parse(existingData) as { [key: string]: FormDataInterface };
            setClientDetails(parsedData);
            setAllClientDetails(parsedData);
        }
    }, []);

    return (
        <>
            <Box >
                <Center>
                    <Button ref={btnRef} leftIcon={<LuSettings2 />} colorScheme='teal' mt={3} onClick={onOpen}>
                        Filters
                    </Button>
                    <Drawer
                        isOpen={isOpen}
                        placement='right'
                        onClose={onClose}
                        finalFocusRef={btnRef}
                    >
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>Filter</DrawerHeader>
                            <DrawerBody>
                                <Text>Status</Text>
                                <RadioGroup my='2' onChange={setValue} value={value}>
                                    <Stack direction='row'>
                                        <Radio value='active'>Active</Radio>
                                        <Radio value='inactive'>Inactive</Radio>
                                    </Stack>
                                </RadioGroup>
                                <Text my='2'>Date</Text>
                                <Input type='date' onChange={(e) => setFilterDate(e.target.value)} value={filterDate} />


                            </DrawerBody>

                            <DrawerFooter display='flex' justifyContent='space-between'>
                                <Button colorScheme='red' onClick={handleReset}>Reset</Button>
                                <Button variant='outline' mr={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='blue' onClick={handleDrawerFilter}>
                                    Apply
                                </Button>

                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>

                </Center>
            </Box >
            <Center p={4} >


                <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing='8'>

                    {Object.keys(clientDetails).map((userKey) => (
                        <Box
                            p='10'
                            // w={280}
                            textAlign='center'
                            rounded='lg'
                            boxShadow='dark-lg'
                            key={userKey}
                            mt='4'
                            border='1px solid Teal-100'
                        >
                            <Text>Contact Information: {clientDetails[userKey].contact}</Text>
                            <Text>Name: {clientDetails[userKey].name}</Text>
                            <Image src={clientDetails[userKey].avatar} alt='Profile' />
                            <Text>Organization: {clientDetails[userKey].organization}</Text>
                            <Text>Assigned User: {clientDetails[userKey].assignedUser}</Text>
                            <Text>Status: {clientDetails[userKey].status}</Text>
                            <Flex justifyContent='space-between' py={4} >

                                <Button colorScheme='red' mx={2} onClick={() => handleDelete(clientDetails[userKey].id as string)}>Delete</Button>
                                <Button colorScheme='blue' onClick={() => handleStatusToggle(clientDetails[userKey].id as string)}>
                                    Toggle Status
                                </Button>
                            </Flex>
                            <Button colorScheme='green'>View Client Details</Button>
                        </Box>
                    ))}
                </SimpleGrid>



            </Center>
        </>
    );
}