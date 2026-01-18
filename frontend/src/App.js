import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar'; // Remove old navbar if you want
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import Cart from './pages/Cart';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';  

function App() {
  return (
    <Router>
      {/* <Navbar />  <-- You can remove this line to avoid double headers on dashboard */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;