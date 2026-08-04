import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="header">
            <div className="logo">
                <i className="fas fa-landmark"></i> Money Manager
            </div>
            {user && (
                <div className="user-menu">
                    <div className="user-toggle">
                        <span>Welcome, {user.firstName}</span>
                        <i className="fas fa-user"></i>
                        <i style={{ marginLeft: '5px' }} className="fas fa-caret-down"></i>
                    </div>
                    <div className="dropdown-content">
                        <Link to="/settings">
                            <i className="fas fa-cog" style={{ marginRight: '8px' }}></i> Settings
                        </Link>
                        <button onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
