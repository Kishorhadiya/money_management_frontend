import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-bg">
            <div className="form-container">
                <div className="form-header">🔐 Log Into Your Account</div>

                {error && (
                    <div className="message error">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : '🔓 Login'}
                    </button>
                </form>

                <div className="page-link">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <br /><br />
                    Don’t have an account? <Link to="/signup">Register</Link>
                </div>

                <div className="footer">
                    &copy; 2025 Money Manager <br /> Developed by Hadiya Kishor and Prajapati Shanikumar
                </div>
            </div>
        </div>
    );
};

export default Login;
