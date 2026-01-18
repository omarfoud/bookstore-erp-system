import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Button,
  TableContainer, Badge, Card, useColorModeValue,
  Heading, useToast, Icon, Flex, Text
} from '@chakra-ui/react';
import { FaTrash, FaUserShield } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  // --- COLOR HOOKS ---
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          toast({ title: "Access Denied", status: "error", duration: 3000 });
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (role, id) => {
    if(!window.confirm("Are you sure? This will delete all their data.")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${role}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast({ title: "User deleted", status: "success", duration: 2000 });
        setUsers(users.filter(u => u.id !== id)); // Optimistic update
      } else {
        toast({ title: "Error deleting user", status: "error" });
      }
    } catch (err) {
      toast({ title: "Server Error", status: "error" });
    }
  };

  // Reusable Header
  const TableHeader = ({ children }) => (
    <Th bg={headerBg} color={subTextColor} borderBottom="1px solid" borderColor={borderColor} textTransform="uppercase" fontSize="xs">
      {children}
    </Th>
  );

  return (
    <DashboardLayout title="Super Admin Panel" activeModule="admin">
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg" color="red.500">
                <Icon as={FaUserShield} mr={2} mb={1}/>
                System Administration
            </Heading>
            <Badge colorScheme="red" p={2} borderRadius="md" fontSize="0.9em">Restricted Access</Badge>
        </Flex>

        <Card bg={cardBg} border="1px solid" borderColor={borderColor} shadow="sm">
            <TableContainer>
            <Table variant="simple">
                <Thead>
                <Tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Action</TableHeader>
                </Tr>
                </Thead>
                <Tbody>
                {users.map((user, index) => (
                    <Tr key={index} _hover={{ bg: hoverBg }}>
                        <Td fontWeight="bold" color={textColor}>
                            {user.name || "N/A"}
                        </Td>
                        <Td color={subTextColor}>
                            {user.email}
                        </Td>
                        <Td>
                            <Badge 
                                colorScheme={user.role === 'vendor' ? 'orange' : 'blue'} 
                                variant="subtle"
                                px={2} py={1} borderRadius="full"
                            >
                            {user.role.toUpperCase()}
                            </Badge>
                        </Td>
                        <Td>
                            <Button 
                                leftIcon={<FaTrash />} 
                                size="sm" 
                                colorScheme="red" 
                                variant="outline"
                                _hover={{ bg: 'red.500', color: 'white' }}
                                onClick={() => handleDelete(user.role, user.id)}
                            >
                            Delete User
                            </Button>
                        </Td>
                    </Tr>
                ))}
                </Tbody>
            </Table>
            </TableContainer>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default AdminDashboard;