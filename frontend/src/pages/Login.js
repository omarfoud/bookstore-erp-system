import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flex, Box, FormControl, FormLabel, Input, Select, 
  Button, Heading, Text, useColorModeValue, Stack
} from '@chakra-ui/react';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  // --- DARK MODE COLORS ---
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', 1);
        
        if (data.role === 'super_admin') navigate('/admin');
        else if (data.role === 'vendor') navigate('/dashboard');
        else navigate('/home');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <Flex minH="100vh" direction="column" bg={bg}>
      <Flex align="center" justify="center" flex="1" px={4}>
        <Box 
          rounded="lg" 
          bg={cardBg} 
          boxShadow="lg" 
          p={8} 
          w="full" 
          maxW="md"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Stack spacing={4}>
            <Heading fontSize="2xl" textAlign="center" color={textColor}>Sign In</Heading>
            <form onSubmit={handleLogin}>
              <FormControl id="email" mb={4}>
                <FormLabel color={textColor}>Email address</FormLabel>
                <Input 
                  type="email" 
                  bg={inputBg}
                  color={textColor}
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </FormControl>
              
              <FormControl id="password" mb={4}>
                <FormLabel color={textColor}>Password</FormLabel>
                <Input 
                  type="password" 
                  bg={inputBg}
                  color={textColor}
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </FormControl>

              <FormControl id="role" mb={6}>
                <FormLabel color={textColor}>Login As</FormLabel>
                <Select 
                  bg={inputBg}
                  color={textColor}
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor Admin</option>
                  <option value="super_admin">Super Admin</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                Login
              </Button>
            </form>
            <Text align="center" color={textColor}>
              Don't have an account? <Link to="/register" style={{ color: '#3182ce' }}>Sign up</Link>
            </Text>
          </Stack>
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default Login;