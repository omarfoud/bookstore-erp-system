import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, Heading, Text, Button, Image, Stack, IconButton, Divider,
  useColorModeValue, Container, useToast, Badge, Card, CardBody,
  Stat, StatLabel, StatNumber, StatHelpText
} from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { FaShoppingBag } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // --- COLORS ---
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 1. Load Cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // Ensure every item has a quantity property
    const normalizedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setCart(normalizedCart);
  }, []);

  // 2. Update Local Storage helper
  const updateCartStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage")); // Updates Navbar badge
  };

  // 3. Handlers
  const increaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    updateCartStorage(newCart);
  };

  const decreaseQty = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      updateCartStorage(newCart);
    }
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCartStorage(newCart);
    toast({ title: "Item removed", status: "info", duration: 1000 });
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  // 4. Checkout API Call
  const handleCheckout = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      toast({ title: "Please Login first", status: "error" });
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/sales/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: userId, cart: cart }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem('cart');
        setCart([]);
        window.dispatchEvent(new Event("storage"));
        toast({
          title: "Order Placed Successfully!",
          description: "Your books are on the way.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/home');
      } else {
        toast({ title: "Checkout Failed", description: data.error || data.message, status: "error" });
      }
    } catch (err) {
      toast({ title: "Server Error", description: "Could not connect to backend.", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <DashboardLayout title="My Cart" activeModule="cart">
      <Container maxW="6xl" py={6}>
        <Heading mb={6} fontSize="2xl" color="teal.500">Shopping Cart</Heading>

        {cart.length === 0 ? (
          <Flex direction="column" align="center" justify="center" h="50vh" bg={cardBg} borderRadius="lg" border="1px dashed" borderColor={borderColor}>
            <FaShoppingBag size="50px" color="#CBD5E0" />
            <Text mt={4} fontSize="lg" color="gray.500">Your cart is empty.</Text>
            <Button mt={4} colorScheme="teal" onClick={() => navigate('/home')}>
              Browse Books
            </Button>
          </Flex>
        ) : (
          <Stack direction={{ base: 'column', md: 'row' }} spacing={8} align="flex-start">
            
            {/* LEFT: CART ITEMS LIST */}
            <Box flex="3" w="full">
              <Stack spacing={4}>
                {cart.map((item, index) => (
                  <Card key={index} direction="row" overflow="hidden" variant="outline" borderColor={borderColor} bg={cardBg}>
                    {/* Placeholder Image */}
                    <Flex w="120px" bg="gray.100" align="center" justify="center" display={{ base: 'none', sm: 'flex' }}>
                      <FaShoppingBag color="gray" size="24px" />
                    </Flex>

                    <Stack p={4} w="full">
                      <CardBody p={0}>
                        <Flex justify="space-between" align="flex-start">
                          <Box>
                            <Heading size="md" mb={1}>{item.title}</Heading>
                            <Text color={textColor}>Unit Price: ${item.price}</Text>
                          </Box>
                          <Text fontWeight="bold" fontSize="lg" color="teal.600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Flex>

                        <Flex mt={4} justify="space-between" align="center">
                          <Flex align="center" border="1px solid" borderColor={borderColor} borderRadius="md">
                            <IconButton 
                              icon={<MinusIcon />} 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => decreaseQty(index)} 
                              isDisabled={item.quantity <= 1}
                            />
                            <Text px={4} fontWeight="bold">{item.quantity}</Text>
                            <IconButton 
                              icon={<AddIcon />} 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => increaseQty(index)} 
                            />
                          </Flex>

                          <Button 
                            leftIcon={<DeleteIcon />} 
                            colorScheme="red" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            Remove
                          </Button>
                        </Flex>
                      </CardBody>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* RIGHT: ORDER SUMMARY */}
            <Box flex="1" w="full">
              <Card variant="outline" borderColor={borderColor} bg={cardBg} position="sticky" top="80px">
                <CardBody>
                  <Heading size="md" mb={4}>Order Summary</Heading>
                  
                  <Stack spacing={3} mb={6}>
                    <Flex justify="space-between">
                      <Text color={textColor}>Subtotal</Text>
                      <Text fontWeight="bold">${calculateTotal()}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color={textColor}>Tax (Estimate)</Text>
                      <Text fontWeight="bold">$0.00</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" fontSize="xl" fontWeight="bold" color="teal.500">
                      <Text>Total</Text>
                      <Text>${calculateTotal()}</Text>
                    </Flex>
                  </Stack>

                  <Button 
                    colorScheme="teal" 
                    size="lg" 
                    w="full" 
                    rightIcon={<ArrowForwardIcon />}
                    isLoading={loading}
                    loadingText="Processing"
                    onClick={handleCheckout}
                  >
                    Checkout Now
                  </Button>
                  
                  <Stat mt={6} textAlign="center">
                    <StatLabel fontSize="xs" color="gray.500">Secure Checkout</StatLabel>
                    <StatHelpText fontSize="xs">Powered by Bookstore ERP</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Box>

          </Stack>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Cart;