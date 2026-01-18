import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Button,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Select,
  Stat, StatLabel, StatNumber, SimpleGrid, Card, CardBody, 
  TableContainer, Badge, useColorModeValue, Text, Flex, Icon
} from '@chakra-ui/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FaClipboardList, FaMoneyBillWave, FaUserClock } from 'react-icons/fa';

const VendorDashboard = () => {
  const [searchParams] = useSearchParams();
  const currentModule = searchParams.get('module') || 'inventory'; 

  const [data, setData] = useState([]);
  const [finance, setFinance] = useState({ records: [], total_income: 0 });
  const [activeSubTab, setActiveSubTab] = useState('');

  // Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };

  // --- COLOR HOOKS ---
  const tableRowBg = useColorModeValue('white', 'gray.800');
  const tableHoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.900');
  const inputColor = useColorModeValue('gray.800', 'white');

  // --- CONFIGURATION ---
  const moduleConfig = {
    inventory: {
      title: 'Supply Chain Management',
      tabs: [
        { id: 'products', label: 'Products' },
        { id: 'operations', label: 'Restock Requests' }
      ]
    },
    sales: {
      title: 'Sales & CRM',
      tabs: [
        { id: 'orders', label: 'Sales Orders' }, 
        { id: 'subscriptions', label: 'Subscriptions' }
      ]
    },
    finance: {
      title: 'Accounting & Finance',
      tabs: [
        { id: 'dashboard', label: 'Financial Overview' },
        { id: 'journal', label: 'Journal Entries' }
      ]
    },
    hr: {
      title: 'Human Resources',
      tabs: [
        { id: 'employees', label: 'Employees' },
        { id: 'attendance', label: 'Attendance Logs' }
      ]
    }
  };

  const currentConfig = moduleConfig[currentModule];

  // --- EFFECTS ---
  useEffect(() => {
    if (currentConfig && currentConfig.tabs.length > 0) {
      setActiveSubTab(currentConfig.tabs[0].id);
    }
    // eslint-disable-next-line
  }, [currentModule]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentModule, activeSubTab]);

  // --- DATA FETCHING ---
  const fetchData = (query = '') => {
    // 1. INVENTORY
    if (currentModule === 'inventory') {
        fetch(`http://localhost:5000/api/inventory/books?q=${query}`, { headers })
          .then(res => res.json()).then(setData);
    } 
    // 2. SALES
    else if (currentModule === 'sales') {
        if (activeSubTab === 'orders') {
            fetch('http://localhost:5000/api/sales/vendor/history', { headers })
                .then(res => res.json()).then(setData);
        } else {
             // Mock subscription data or fetch real one
             setData([]); 
        }
    } 
    // 3. HR
    else if (currentModule === 'hr') {
        if (activeSubTab === 'employees') {
            fetch('http://localhost:5000/api/hr/employees', { headers })
                .then(res => res.json()).then(setData);
        } else if (activeSubTab === 'attendance') {
            fetch('http://localhost:5000/api/hr/attendance/history', { headers })
                .then(res => res.json()).then(setData);
        }
    } 
    // 4. FINANCE
    else if (currentModule === 'finance') {
        fetch('http://localhost:5000/api/finance/report', { headers })
          .then(res => res.json()).then(setFinance);
    }
  };

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async () => {
    let url = '', method = 'POST';
    
    if (modalType === 'addBook') url = 'http://localhost:5000/api/inventory/books';
    else if (modalType === 'procure') {
        url = 'http://localhost:5000/api/inventory/procure';
        formData.book_id = selectedItem.id;
    }
    else if (modalType === 'addEmp') url = 'http://localhost:5000/api/hr/employees';
    else if (modalType === 'attendance') {
        url = 'http://localhost:5000/api/hr/attendance';
        formData.employee_id = selectedItem.id;
    }

    await fetch(url, {
      method,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    onClose();
    fetchData(); // Refresh data
  };

  // --- RENDER HELPERS ---
  const TableHeader = ({ children, isNumeric }) => (
    <Th bg={headerBg} color={subTextColor} borderBottom="1px solid" borderColor={borderColor} isNumeric={isNumeric} textTransform="uppercase" letterSpacing="wider" fontSize="xs">
      {children}
    </Th>
  );

  const renderContent = () => {
    // ================== SALES MODULE ==================
    if (currentModule === 'sales') {
        if (activeSubTab === 'orders') {
            return (
                <Card shadow="sm" border="1px solid" borderColor={borderColor} bg={tableRowBg}>
                    <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                        <Text fontSize="md" fontWeight="bold" color={textColor} display="flex" alignItems="center">
                            <Icon as={FaMoneyBillWave} mr={2} color="green.500"/> Recent Sales Orders
                        </Text>
                    </Box>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead><Tr><TableHeader>Date</TableHeader><TableHeader>Customer</TableHeader><TableHeader>Book</TableHeader><TableHeader isNumeric>Qty</TableHeader><TableHeader isNumeric>Total</TableHeader></Tr></Thead>
                            <Tbody>
                                {data.length === 0 ? <Tr><Td colSpan={5} textAlign="center" color="gray.500">No sales yet.</Td></Tr> : 
                                data.map((order) => (
                                    <Tr key={order.id} bg={tableRowBg} _hover={{ bg: tableHoverBg }}>
                                        <Td color={textColor}>{new Date(order.order_date).toLocaleDateString()}</Td>
                                        <Td fontWeight="bold" color={textColor}>{order.customer_name}</Td>
                                        <Td color={subTextColor}>{order.book_title}</Td>
                                        <Td isNumeric color={textColor}>{order.quantity}</Td>
                                        <Td isNumeric fontWeight="bold" color="green.500">${order.total_price}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            );
        } else {
             return <Box p={10} textAlign="center" color="gray.500">Subscription Module coming soon.</Box>;
        }
    }

    // ================== INVENTORY MODULE ==================
    if (currentModule === 'inventory') {
      if (activeSubTab === 'products') {
        return (
          <Box>
            <Flex justify="flex-end" mb={4}>
                <Button colorScheme="teal" onClick={() => { setModalType('addBook'); onOpen(); }}>+ New Product</Button>
            </Flex>
            <Card shadow="sm" border="1px solid" borderColor={borderColor} bg={tableRowBg}>
                <TableContainer>
                    <Table variant="simple">
                        <Thead><Tr><TableHeader>Title</TableHeader><TableHeader>Author</TableHeader><TableHeader isNumeric>Price</TableHeader><TableHeader isNumeric>Stock</TableHeader></Tr></Thead>
                        <Tbody>
                            {data.map(b => (
                                <Tr key={b.id} bg={tableRowBg} _hover={{ bg: tableHoverBg }}>
                                    <Td fontWeight="medium" color={textColor}>{b.title}</Td>
                                    <Td color={subTextColor}>{b.author}</Td>
                                    <Td isNumeric fontWeight="bold" color={textColor}>${b.price}</Td>
                                    <Td isNumeric>
                                        <Badge colorScheme={b.stock < 10 ? 'red' : 'green'}>{b.stock} Units</Badge>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Card>
          </Box>
        );
      } else if (activeSubTab === 'operations') {
        return (
          <Card shadow="sm" border="1px solid" borderColor={borderColor} bg={tableRowBg}>
            <TableContainer>
              <Table variant="simple">
                <Thead><Tr><TableHeader>Product</TableHeader><TableHeader>Current Stock</TableHeader><TableHeader>Action</TableHeader></Tr></Thead>
                <Tbody>{data.map(b => (
                  <Tr key={b.id} bg={tableRowBg} _hover={{ bg: tableHoverBg }}>
                    <Td color={textColor} fontWeight="bold">{b.title}</Td>
                    <Td color={textColor}>{b.stock}</Td>
                    <Td><Button size="sm" variant="outline" colorScheme="orange" onClick={() => { setModalType('procure'); setSelectedItem(b); onOpen(); }}>Create PO</Button></Td>
                  </Tr>
                ))}</Tbody>
              </Table>
            </TableContainer>
          </Card>
        );
      }
    }

    // ================== HR MODULE ==================
    if (currentModule === 'hr') {
        if (activeSubTab === 'employees') {
            return (
                <>
                <Flex justify="flex-end" mb={4}>
                    <Button colorScheme="blue" onClick={() => { setModalType('addEmp'); onOpen(); }}>+ New Employee</Button>
                </Flex>
                <Card shadow="sm" border="1px solid" borderColor={borderColor} bg={tableRowBg}>
                    <TableContainer>
                        <Table>
                            <Thead><Tr><TableHeader>Name</TableHeader><TableHeader>Role</TableHeader><TableHeader isNumeric>Salary</TableHeader><TableHeader>Actions</TableHeader></Tr></Thead>
                            <Tbody>
                                {data.map(e => (
                                    <Tr key={e.id} bg={tableRowBg} _hover={{ bg: tableHoverBg }}>
                                        <Td color={textColor} fontWeight="bold">{e.name}</Td>
                                        <Td color={subTextColor}>{e.position}</Td>
                                        <Td isNumeric color={textColor}>${e.salary}</Td>
                                        <Td>
                                            <Button size="xs" colorScheme="purple" onClick={() => { setModalType('attendance'); setSelectedItem(e); onOpen(); }}>Log Attendance</Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
                </>
            );
        } else if (activeSubTab === 'attendance') {
            return (
                <Card shadow="sm" border="1px solid" borderColor={borderColor} bg={tableRowBg}>
                    <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                        <Text fontSize="md" fontWeight="bold" color={textColor} display="flex" alignItems="center">
                            <Icon as={FaUserClock} mr={2} color="purple.500"/> Daily Attendance Log
                        </Text>
                    </Box>
                    <TableContainer>
                        <Table>
                            <Thead><Tr><TableHeader>Date</TableHeader><TableHeader>Employee</TableHeader><TableHeader>Position</TableHeader><TableHeader>Status</TableHeader></Tr></Thead>
                            <Tbody>
                                {data.length === 0 ? <Tr><Td colSpan={4} textAlign="center" color="gray.500">No logs found.</Td></Tr> :
                                data.map(log => (
                                    <Tr key={log.id} bg={tableRowBg} _hover={{ bg: tableHoverBg }}>
                                        <Td color={textColor}>{new Date(log.date).toLocaleDateString()}</Td>
                                        <Td fontWeight="bold" color={textColor}>{log.employee_name}</Td>
                                        <Td color={subTextColor}>{log.position}</Td>
                                        <Td>
                                            <Badge colorScheme={log.status === 'Present' ? 'green' : log.status === 'Absent' ? 'red' : 'orange'}>
                                                {log.status}
                                            </Badge>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            );
        }
    }

    // ================== FINANCE MODULE ==================
    if (currentModule === 'finance') {
        const expense = finance.records.filter(r => r.transaction_type === 'Expense').reduce((a, b) => a + parseFloat(b.amount), 0);
        const profit = finance.total_income - expense;
        
        const chartData = [
            { name: 'Revenue', amount: finance.total_income },
            { name: 'Expenses', amount: expense },
            { name: 'Net Profit', amount: profit }
        ];

        return (
            <Box>
                {/* Stats Cards */}
                <SimpleGrid columns={{base: 1, md: 3}} spacing={6} mb={8}>
                    <Card borderTop="4px solid" borderColor="green.400" bg={tableRowBg} shadow="sm">
                        <CardBody><Stat><StatLabel color="gray.500">Total Income</StatLabel><StatNumber fontSize="2xl" color="green.500">${finance.total_income.toFixed(2)}</StatNumber></Stat></CardBody>
                    </Card>
                    <Card borderTop="4px solid" borderColor="red.400" bg={tableRowBg} shadow="sm">
                        <CardBody><Stat><StatLabel color="gray.500">Total Expenses</StatLabel><StatNumber fontSize="2xl" color="red.500">${expense.toFixed(2)}</StatNumber></Stat></CardBody>
                    </Card>
                    <Card borderTop="4px solid" borderColor="blue.400" bg={tableRowBg} shadow="sm">
                        <CardBody><Stat><StatLabel color="gray.500">Net Profit</StatLabel><StatNumber fontSize="2xl" color="blue.500">${profit.toFixed(2)}</StatNumber></Stat></CardBody>
                    </Card>
                </SimpleGrid>
                
                {/* Chart */}
                <Card mb={8} p={4} bg={tableRowBg} border="1px solid" borderColor={borderColor}>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>Financial Performance</Text>
                    <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke={subTextColor} />
                                <YAxis stroke={subTextColor} />
                                <Tooltip contentStyle={{ backgroundColor: tableRowBg, borderColor: borderColor, color: textColor }} cursor={{fill: 'transparent'}} />
                                <Bar dataKey="amount" fill="#319795" barSize={60} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Card>

                {/* Journal Table */}
                <Card shadow="sm" border="1px solid" borderColor={borderColor} bg={tableRowBg}>
                    <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
                        <Text fontSize="md" fontWeight="bold" color={textColor} display="flex" alignItems="center">
                            <Icon as={FaClipboardList} mr={2} color="blue.500"/> General Journal Entries
                        </Text>
                    </Box>
                    <TableContainer>
                        <Table variant="simple" size="sm">
                            <Thead><Tr><TableHeader>Date</TableHeader><TableHeader>Description</TableHeader><TableHeader>Type</TableHeader><TableHeader isNumeric>Amount</TableHeader></Tr></Thead>
                            <Tbody>{finance.records.map(r => (
                                <Tr key={r.id} bg={tableRowBg} _hover={{ bg: tableHoverBg }}>
                                    <Td color={textColor}>{new Date(r.transaction_date).toLocaleDateString()}</Td>
                                    <Td color={textColor}>{r.description}</Td>
                                    <Td><Badge colorScheme={r.transaction_type === 'Income' ? 'green' : 'red'}>{r.transaction_type}</Badge></Td>
                                    <Td isNumeric color={textColor}>${r.amount}</Td>
                                </Tr>
                            ))}</Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </Box>
        )
    }

    return <Box p={10} textAlign="center" color="gray.500">Select a module from the sidebar.</Box>;
  };

  return (
    <DashboardLayout 
      title={currentConfig?.title} 
      activeModule={currentModule}
      subTabs={currentConfig?.tabs}
      activeSubTab={activeSubTab}
      setActiveSubTab={setActiveSubTab}
      onSearch={(q) => fetchData(q)}
    >
      {renderContent()}

      {/* SHARED MODAL FOR ALL ACTIONS */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent bg={tableRowBg}>
          <ModalHeader borderBottom="1px solid" borderColor={borderColor} color={textColor}>
            {modalType === 'addBook' && 'Create Product'}
            {modalType === 'procure' && 'Purchase Order'}
            {modalType === 'addEmp' && 'New Employee'}
            {modalType === 'attendance' && 'Mark Attendance'}
          </ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody pb={6} pt={6}>
            
            {/* BOOK FORM */}
            {modalType === 'addBook' && (
                <SimpleGrid columns={2} spacing={4}>
                    <FormControl><FormLabel color={subTextColor}>Title</FormLabel><Input name="title" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl><FormLabel color={subTextColor}>Author</FormLabel><Input name="author" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl><FormLabel color={subTextColor}>Price ($)</FormLabel><Input name="price" type="number" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl><FormLabel color={subTextColor}>Cost ($)</FormLabel><Input name="cost" type="number" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl><FormLabel color={subTextColor}>Stock</FormLabel><Input name="stock" type="number" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl><FormLabel color={subTextColor}>Image URL</FormLabel><Input name="image_url" placeholder="http://..." onChange={handleInputChange} color={inputColor} /></FormControl>
                </SimpleGrid>
            )}

            {/* RESTOCK FORM */}
            {modalType === 'procure' && (
                <>
                    <FormControl><FormLabel color={subTextColor}>Quantity</FormLabel><Input name="quantity" type="number" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl mt={4}><FormLabel color={subTextColor}>Unit Cost ($)</FormLabel><Input name="cost" type="number" onChange={handleInputChange} color={inputColor} /></FormControl>
                </>
            )}

            {/* EMPLOYEE FORM */}
            {modalType === 'addEmp' && (
                <>
                    <FormControl><FormLabel color={subTextColor}>Name</FormLabel><Input name="name" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl mt={4}><FormLabel color={subTextColor}>Position</FormLabel><Input name="position" onChange={handleInputChange} color={inputColor} /></FormControl>
                    <FormControl mt={4}><FormLabel color={subTextColor}>Salary</FormLabel><Input name="salary" type="number" onChange={handleInputChange} color={inputColor} /></FormControl>
                </>
            )}

            {/* ATTENDANCE FORM */}
            {modalType === 'attendance' && (
                <FormControl>
                    <FormLabel color={subTextColor}>Status for {selectedItem?.name}</FormLabel>
                    <Select name="status" onChange={handleInputChange} color={inputColor}>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">On Leave</option>
                    </Select>
                </FormControl>
            )}

            <Button colorScheme="teal" mt={6} w="full" onClick={handleSubmit}>Save Record</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default VendorDashboard;