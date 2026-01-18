import React, { useEffect, useState } from 'react';
import { 
    Box, Table, Thead, Tbody, Tr, Th, Td, Image, Badge, Heading, useColorModeValue 
} from '@chakra-ui/react';
import DashboardLayout from '../components/DashboardLayout';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('user_id');
    const tableBg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        fetch(`http://localhost:5000/api/sales/orders/${userId}`)
            .then(res => res.json())
            .then(data => setOrders(data));
    }, [userId]);

    return (
        <DashboardLayout title="My Orders" activeModule="orders">
            <Heading size="md" mb={6}>Order History</Heading>
            <Box bg={tableBg} p={4} rounded="md" shadow="sm" overflowX="auto">
                <Table variant="simple">
                    <Thead><Tr><Th>Date</Th><Th>Book</Th><Th>Cover</Th><Th>Qty</Th><Th>Total</Th><Th>Status</Th></Tr></Thead>
                    <Tbody>
                        {orders.map(order => (
                            <Tr key={order.id}>
                                <Td>{new Date(order.order_date).toLocaleDateString()}</Td>
                                <Td fontWeight="bold">{order.title}</Td>
                                <Td>
                                    <Image src={order.image_url || "https://via.placeholder.com/50"} boxSize="50px" objectFit="cover" />
                                </Td>
                                <Td>{order.quantity}</Td>
                                <Td>${order.total_price}</Td>
                                <Td><Badge colorScheme="green">{order.status}</Badge></Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </DashboardLayout>
    );
};

export default Orders;