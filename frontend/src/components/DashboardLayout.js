import React from 'react';
import {
  Box, Flex, IconButton, useDisclosure, Drawer, DrawerBody, 
  DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton,
  VStack, Text, Button, useColorMode, useColorModeValue,
  Menu, MenuButton, MenuList, MenuItem, Avatar, HStack,
  Input, InputGroup, InputLeftElement, Link, Icon, Badge
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars, FaMoon, FaSun, FaChevronDown, FaSearch, 
  FaGithub, FaLinkedin, FaShoppingBag, FaShoppingCart, FaUserShield
} from 'react-icons/fa';
import Footer from './Footer';

const DashboardLayout = ({ title, activeModule, subTabs, activeSubTab, setActiveSubTab, onSearch, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  
  const role = localStorage.getItem('role');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // --- STYLE CONFIG ---
  const sidebarBg = 'gray.900'; 
  const sidebarTextColor = 'gray.400';
  const sidebarActiveColor = 'white';
  const sidebarActiveBg = 'whiteAlpha.200';
  
  const mainBg = useColorModeValue('gray.50', 'gray.900');
  const tabBg = useColorModeValue('white', 'gray.800');

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // --- DYNAMIC MENUS BASED ON ROLE ---
  const vendorMenu = [
    { name: 'Sales & CRM', id: 'sales', path: '/dashboard?module=sales' },
    { name: 'Supply Chain', id: 'inventory', path: '/dashboard?module=inventory' },
    { name: 'Accounting', id: 'finance', path: '/dashboard?module=finance' },
    { name: 'HR & Employees', id: 'hr', path: '/dashboard?module=hr' },
  ];

  const customerMenu = [
    { name: 'Browse Shop', id: 'shop', path: '/home', icon: FaShoppingBag },
    { name: 'My Cart', id: 'cart', path: '/cart', icon: FaShoppingCart },
    { name: 'Order History', id: 'orders', path: '/orders', icon: FaBars },
  ];

  const superAdminMenu = [
    { name: 'User Management', id: 'admin', path: '/admin', icon: FaUserShield },
  ];

  // 1. FIX SIDEBAR CONTENT
  let menuItems = customerMenu;
  if (role === 'vendor') menuItems = vendorMenu;
  if (role === 'super_admin') menuItems = superAdminMenu;

  // 2. FIX USER LABEL
  const getUserLabel = () => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'vendor') return 'Vendor Admin';
    return 'Customer';
  }

  const getAvatarColor = () => {
    if (role === 'super_admin') return 'purple.500';
    if (role === 'vendor') return 'red.500';
    return 'blue.500';
  }

  return (
    <Box minH="100vh" bg={mainBg} display="flex" flexDirection="column">
      
      {/* TOP NAVBAR */}
      <Flex 
        bg={sidebarBg} 
        color="white" 
        p={3} 
        alignItems="center" 
        justify="space-between"
        h="64px"
        position="sticky"
        top="0"
        zIndex="1000"
        boxShadow="md"
      >
        <HStack spacing={4}>
          <IconButton 
            icon={<Icon as={FaBars} boxSize={5} />} 
            onClick={onOpen} 
            variant="ghost" 
            color="white" 
            _hover={{ bg: 'whiteAlpha.200' }}
            aria-label="Open Menu" 
          />
          <Text fontSize="lg" fontWeight="bold" letterSpacing="wide">BOOKSTORE ERP</Text>
          <Box h="20px" w="1px" bg="whiteAlpha.400" mx={2} />
          <Text fontSize="sm" color="gray.300" fontWeight="medium">{title}</Text>
        </HStack>

        {/* Search Bar */}
        <Box w="400px" display={{ base: 'none', md: 'block' }}>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.500" />
            </InputLeftElement>
            <Input 
              type="text" 
              placeholder={role === 'customer' ? "Search Books..." : "Search..."}
              bg="gray.800" 
              border="1px solid"
              borderColor="gray.700"
              color="white"
              borderRadius="md"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ bg: 'gray.700', borderColor: 'blue.500' }}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </InputGroup>
        </Box>

        <HStack spacing={3}>
          <IconButton 
            size="sm"
            icon={colorMode === 'light' ? <Icon as={FaMoon} /> : <Icon as={FaSun} />} 
            onClick={toggleColorMode} 
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            isRound 
          />
          <Menu>
            <MenuButton as={Button} size="sm" rightIcon={<Icon as={FaChevronDown} />} variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
              <Avatar size="xs" name={role} mr={2} bg={getAvatarColor()} /> 
              {getUserLabel()}
            </MenuButton>
            <MenuList color="black">
              <MenuItem onClick={logout} color="red.500">Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* CONTEXTUAL TABS */}
      {subTabs && (
        <Flex 
          bg={tabBg} 
          px={6} 
          borderBottom="1px solid" 
          borderColor="gray.200" 
          align="flex-end"
          h="48px"
          boxShadow="sm"
        >
          {subTabs.map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant="unstyled"
              borderRadius="0"
              h="100%"
              px={4}
              mr={2}
              borderBottom={activeSubTab === tab.id ? "3px solid" : "3px solid transparent"}
              borderColor={activeSubTab === tab.id ? "teal.500" : "transparent"}
              color={activeSubTab === tab.id ? "teal.600" : "gray.500"}
              fontWeight={activeSubTab === tab.id ? "bold" : "medium"}
              _hover={{ color: "teal.500", bg: "gray.50" }}
              onClick={() => setActiveSubTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </Flex>
      )}

      {/* MAIN CONTENT AREA */}
      <Box p={6} maxW="1600px" mx="auto" flex="1" w="100%">
        {children}
      </Box>

      <Footer />

      {/* SIDEBAR DRAWER */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg} color="white">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
            <Text fontSize="md">Navigation</Text>
          </DrawerHeader>
          
          <DrawerBody p={0}>
            <VStack align="stretch" spacing={1} mt={2}>
              {menuItems.map((item) => (
                <Button 
                  key={item.id} 
                  variant="ghost" 
                  justifyContent="flex-start" 
                  h="50px"
                  pl={6}
                  fontSize="md"
                  leftIcon={item.icon ? <Icon as={item.icon} /> : undefined}
                  color={activeModule === item.id ? sidebarActiveColor : sidebarTextColor}
                  bg={activeModule === item.id ? sidebarActiveBg : "transparent"}
                  borderLeft={activeModule === item.id ? "4px solid red" : "4px solid transparent"}
                  _hover={{ bg: 'whiteAlpha.100', color: "white" }}
                  borderRadius="0"
                  onClick={() => {
                    if (item.path.includes('http')) {
                        window.location.href = item.path;
                    } else {
                        navigate(item.path);
                    }
                    onClose();
                  }}
                >
                  {item.name}
                  {item.id === 'cart' && cart.length > 0 && (
                    <Badge ml={2} colorScheme="red" variant="solid">{cart.length}</Badge>
                  )}
                </Button>
              ))}
            </VStack>
          </DrawerBody>

          {/* Sidebar Footer Info */}
          <Box p={4} borderTop="1px solid" borderColor="whiteAlpha.200" textAlign="center">
            <Text fontSize="xs" color="gray.500" mb={2}>Contact Developer</Text>
            <HStack justify="center" spacing={4}>
                <Link href="https://github.com/omarfoud" isExternal>
                    <Icon as={FaGithub} color="gray.400" _hover={{color:'white'}} boxSize={5} />
                </Link>
                <Link href="https://www.linkedin.com/in/omar-fouda-07ab01282/" isExternal>
                    <Icon as={FaLinkedin} color="blue.400" _hover={{color:'blue.300'}} boxSize={5} />
                </Link>
            </HStack>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default DashboardLayout;