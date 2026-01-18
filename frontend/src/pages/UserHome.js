import React, { useEffect, useState } from 'react';
import { 
  Box, SimpleGrid, Text, Button, Heading, Badge, Flex, Icon, useToast,
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, 
  DrawerContent, DrawerCloseButton, useDisclosure, VStack, IconButton,
  useColorModeValue, Image, Center
} from '@chakra-ui/react';
import { FaBook, FaTrash, FaBoxOpen, FaShoppingCart } from 'react-icons/fa'; 
import DashboardLayout from '../components/DashboardLayout';

const UserHome = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // --- COLOR HOOKS ---
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const titleColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bg = useColorModeValue('gray.50', 'gray.900');

  // --- DATA FETCHING ---
  const fetchBooks = (query = '') => {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    fetch(`http://localhost:5000/api/inventory/books?q=${query}&page=${page}&limit=8`, { 
        headers: headers 
    })
      .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
      })
      .then(data => {
          if (Array.isArray(data)) setBooks(data);
          else setBooks([]); 
      })
      .catch(err => console.error("Error fetching books:", err));
  };

  // Initial Load & Pagination
  useEffect(() => {
    fetchBooks();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    // eslint-disable-next-line
  }, [page]);

  // --- CART LOGIC ---
  const addToCart = (book) => {
    const newCart = [...cart, { 
      book_id: book.id, 
      title: book.title, 
      price: book.price, 
      quantity: 1,
      tempId: Date.now() // Unique ID to allow multiple of same book if needed
    }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    toast({
      title: "Added to Cart",
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top-right"
    });
    
    onOpen(); // Open drawer immediately
  };

  const removeFromCart = (tempId) => {
    const newCart = cart.filter(item => item.tempId !== tempId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);
  };

  return (
    <DashboardLayout 
        title="Browse Shop" 
        activeModule="shop" 
        onSearch={(q) => fetchBooks(q)}
    >
        
        {/* Header Action */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="teal.500">Available Books</Heading>
          <Button 
            leftIcon={<Icon as={FaShoppingCart} />} 
            colorScheme="teal" 
            variant="outline" 
            onClick={onOpen}
          >
            My Cart ({cart.length})
          </Button>
        </Flex>

        {/* Empty State */}
        {books.length === 0 ? (
            <Center flexDirection="column" py={20}>
                <Icon as={FaBoxOpen} w={20} h={20} color="gray.300" mb={4} />
                <Text fontSize="xl" color="gray.500">No books found.</Text>
                <Text fontSize="sm" color="gray.400">Try adjusting your search or ask the Admin.</Text>
            </Center>
        ) : (
            <>
            {/* Book Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
                {books.map(book => (
                    <Box 
                        key={book.id} 
                        bg={cardBg} 
                        rounded="lg" 
                        shadow="sm" 
                        border="1px solid" 
                        borderColor={borderColor}
                        overflow="hidden"
                        transition="all 0.2s"
                        _hover={{ transform: 'translateY(-5px)', shadow: 'md', borderColor: 'teal.300' }}
                        display="flex"
                        flexDirection="column"
                    >
                        {/* Image Section */}
                        <Box h="200px" position="relative" bg="gray.100">
                            {book.image_url ? (
                                <Image src={book.image_url} alt={book.title} w="100%" h="100%" objectFit="cover" /> 
                            ) : (
                                <Center h="100%"><Icon as={FaBook} w={12} h={12} color="gray.400" /></Center>
                            )}
                            <Badge position="absolute" top={2} right={2} colorScheme={book.stock > 0 ? "green" : "red"}>
                                {book.stock > 0 ? "In Stock" : "Sold Out"}
                            </Badge>
                        </Box>
                        
                        {/* Info Section */}
                        <Box p={4} flex="1" display="flex" flexDirection="column">
                            <Heading size="sm" mb={1} noOfLines={1} color={titleColor} title={book.title}>
                                {book.title}
                            </Heading>
                            <Text fontSize="xs" color={textColor} mb={3} fontStyle="italic">
                                by {book.author}
                            </Text>
                            
                            <Flex justify="space-between" align="center" mt="auto">
                                <Text fontSize="lg" fontWeight="bold" color="teal.500">
                                    ${book.price}
                                </Text>
                                <Button 
                                    colorScheme="teal" 
                                    size="xs" 
                                    isDisabled={book.stock <= 0}
                                    onClick={() => addToCart(book)}
                                >
                                    Add
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>

            {/* Pagination Controls */}
            <Flex justify="center" mt={10} gap={4} align="center">
                <Button onClick={() => setPage(p => Math.max(1, p - 1))} isDisabled={page === 1} size="sm">Previous</Button>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>Page {page}</Text>
                <Button onClick={() => setPage(p => p + 1)} isDisabled={books.length < 8} size="sm">Next</Button>
            </Flex>
            </>
        )}

        {/* Cart Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
            <DrawerOverlay />
            <DrawerContent bg={cardBg}>
            <DrawerCloseButton color={textColor} />
            <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} color={titleColor}>
                Shopping Cart
            </DrawerHeader>

            <DrawerBody>
                {cart.length === 0 ? (
                    <Center h="100%" flexDirection="column">
                         <Icon as={FaShoppingCart} w={10} h={10} color="gray.300" mb={3} />
                         <Text color="gray.500">Your cart is empty.</Text>
                    </Center>
                ) : (
                    <VStack spacing={3} mt={4} align="stretch">
                        {cart.map((item) => (
                            <Flex 
                                key={item.tempId} 
                                justify="space-between" 
                                align="center" 
                                p={3} 
                                borderWidth="1px" 
                                borderRadius="md" 
                                borderColor={borderColor} 
                                bg={bg}
                            >
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" color={titleColor}>{item.title}</Text>
                                    <Text fontSize="xs" color="gray.500">${item.price}</Text>
                                </Box>
                                <IconButton 
                                    icon={<Icon as={FaTrash} />} 
                                    colorScheme="red" 
                                    variant="ghost" 
                                    size="sm"
                                    aria-label="Remove item"
                                    onClick={() => removeFromCart(item.tempId)}
                                />
                            </Flex>
                        ))}
                    </VStack>
                )}
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px" borderColor={borderColor} flexDirection="column">
                <Flex w="100%" justify="space-between" mb={4}>
                    <Text fontWeight="bold" color={titleColor}>Total:</Text>
                    <Text fontWeight="bold" color="teal.500">${calculateTotal()}</Text>
                </Flex>
                <Button 
                    colorScheme="teal" 
                    w="full" 
                    isDisabled={cart.length === 0} 
                    onClick={() => window.location.href='/cart'}
                >
                    Proceed to Checkout
                </Button>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </DashboardLayout>
  );
};

export default UserHome;