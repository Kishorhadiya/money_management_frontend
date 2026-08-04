import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [categoryOpen, setCategoryOpen] = useState(
        location.pathname === '/income-categories' || location.pathname === '/expense-categories'
    );

    const isActive = (path) => location.pathname === path;

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <Link className={isActive('/') ? 'active' : ''} to="/">
                <i className="fas fa-home"></i> Dashboard
            </Link>
            <Link className={isActive('/transactions') ? 'active' : ''} to="/transactions">
                <i className="fas fa-sync-alt"></i> Transaction
            </Link>
            <Link className={isActive('/incomes') ? 'active' : ''} to="/incomes">
                <i className="fas fa-chart-bar"></i> Incomes
            </Link>
            <Link className={isActive('/expenses') ? 'active' : ''} to="/expenses">
                <i className="fas fa-file-alt"></i> Expenses
            </Link>
            <Link className={isActive('/budgets') ? 'active' : ''} to="/budgets">
                <i className="fas fa-wallet"></i> Budgets
            </Link>

            <a className="dropdown-toggle" onClick={() => setCategoryOpen(!categoryOpen)}>
                <i className="fas fa-cogs"></i> Categories{' '}
                <i className={`fas fa-angle-${categoryOpen ? 'up' : 'down'}`} style={{ marginLeft: 'auto' }}></i>
            </a>

            {categoryOpen && (
                <div className="submenu">
                    <Link className={isActive('/income-categories') ? 'active' : ''} to="/income-categories">
                        <i className="fas fa-angle-right"></i> Income Categories
                    </Link>
                    <Link className={isActive('/expense-categories') ? 'active' : ''} to="/expense-categories">
                        <i className="fas fa-angle-right"></i> Expense Categories
                    </Link>
                </div>
            )}

            <Link className={isActive('/profit-loss') ? 'active' : ''} to="/profit-loss">
                <i className="fas fa-print"></i> Reports & Graphs
            </Link>
            <Link className={isActive('/settings') ? 'active' : ''} to="/settings">
                <i className="fas fa-user"></i> Profile Settings
            </Link>
            <a href="#logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    );
};

export default Sidebar;
