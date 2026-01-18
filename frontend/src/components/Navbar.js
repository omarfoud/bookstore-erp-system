import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, Flex, Button, Stack, useColorMode, useColorModeValue, // <--- Removed Text
  IconButton, Badge 
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const role = localStorage.getItem('role');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} boxShadow="sm" position="sticky" top="0" zIndex="1000">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box fontWeight="bold" fontSize="xl" color="teal.500">
          <Link to={role === 'vendor' ? "/dashboard" : "/home"}>Bookstore ERP</Link>
        </Box>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={4} align="center">
            {!role && <Link to="/"><Button variant="ghost">Login</Button></Link>}
            {role === 'customer' && (
              <>
                <Link to="/home"><Button variant="ghost">Shop</Button></Link>
                <Link to="/cart"><Button variant="solid" colorScheme="teal" size="sm">Cart <Badge ml={2} colorScheme="red">{cart.length}</Badge></Button></Link>
              </>
            )}
            {role === 'vendor' && <Link to="/dashboard"><Button colorScheme="blue" size="sm">Admin Panel</Button></Link>}
            <IconButton size="sm" icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} variant="ghost" aria-label="Toggle Theme" />
            {role && <Button onClick={logout} variant="outline" size="sm" colorScheme="red">Logout</Button>}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;