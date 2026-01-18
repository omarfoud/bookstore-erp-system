import React from 'react';
import { 
  Box, Container, Stack, Text, Link, IconButton, useColorModeValue 
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      mt="auto" // Pushes footer to bottom if flex container
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2025 Bookstore ERP. All rights reserved.</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href="https://github.com/omarfoud" isExternal>
            <IconButton
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
              size="md"
              colorScheme="gray"
              variant="ghost"
            />
          </Link>
          <Link href="https://www.linkedin.com/in/omar-fouda-07ab01282/" isExternal>
            <IconButton
              aria-label="LinkedIn"
              icon={<FaLinkedin fontSize="1.25rem" />}
              size="md"
              colorScheme="blue"
              variant="ghost"
            />
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;