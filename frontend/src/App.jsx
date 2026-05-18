import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import Logo from './components/Logo';

export default function App() {
    return (
        <BrowserRouter>
            <nav className="nav-bar">
                <Logo />
                <div className="nav-links">
                    <Link to="/" className="nav-link">Customer</Link>
                    <Link to="/admin" className="nav-link">Admin</Link>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<CustomerPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </BrowserRouter>
    );
}
