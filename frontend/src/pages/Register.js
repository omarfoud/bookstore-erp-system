import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flex, Box, FormControl, FormLabel, Input, Select, 
  Button, Heading, Text, useColorModeValue, Stack
} from '@chakra-ui/react';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer'
  });
  const navigate = useNavigate();

  // --- DARK MODE COLORS ---
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.user_id);
        
        if (data.role === 'vendor') navigate('/dashboard');
        else navigate('/home');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to connect to server');
    }
  };

  return (
    <Flex minH="100vh" direction="column" bg={bg}>
      <Flex align="center" justify="center" flex="1" px={4} py={8}>
        <Box rounded="lg" bg={cardBg} boxShadow="lg" p={8} w="full" maxW="md" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <Stack spacing={4}>
                <Heading fontSize="2xl" textAlign="center" color={textColor}>Create Account</Heading>
                <form onSubmit={handleRegister}>
                <FormControl mb={4}>
                    <FormLabel color={textColor}>Full Name</FormLabel>
                    <Input name="name" bg={inputBg} color={textColor} onChange={handleChange} required />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel color={textColor}>Email Address</FormLabel>
                    <Input type="email" name="email" bg={inputBg} color={textColor} onChange={handleChange} required />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel color={textColor}>Password</FormLabel>
                    <Input type="password" name="password" bg={inputBg} color={textColor} onChange={handleChange} required />
                </FormControl>

                <FormControl mb={6}>
                    <FormLabel color={textColor}>I am a:</FormLabel>
                    <Select name="role" bg={inputBg} color={textColor} value={formData.role} onChange={handleChange}>
                    <option value="customer">Customer (Reader)</option>
                    <option value="vendor">Vendor (Admin)</option>
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">Register</Button>
                </form>
                <Text align="center" color={textColor}>
                Already have an account? <Link to="/" style={{ color: '#3498db' }}>Login here</Link>
                </Text>
            </Stack>
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Register;