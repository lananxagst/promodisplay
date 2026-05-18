import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';

export default function App() {
    return (
        <BrowserRouter>
            <nav className="nav-bar">
                <Link to="/" className="nav-link">Customer</Link>
                <Link to="/admin" className="nav-link">Admin</Link>
            </nav>
            <Routes>
                <Route path="/" element={<CustomerPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}
