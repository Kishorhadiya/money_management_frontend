import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        repeat_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.repeat_password) {
            setError('Passwords do not match.');
            return;
        }

        const res = await signup(formData);
        if (res.success) {
            setSuccess('User Registered successfully!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="auth-bg">
            <div className="form-container">
                <div className="form-header">🔒 Create An Account</div>

                {success && <div className="message success">✅ {success}</div>}
                {error && <div className="message error">❌ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="repeat_password"
                        placeholder="Repeat Password"
                        value={formData.repeat_password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : '💾 Save'}
                    </button>
                </form>

                <div className="login-link">
                    Already have account? <Link to="/login">Login Now</Link>
                </div>

                <div className="footer">
                    &copy; 2025 Money Manager <br /> Developed by Hadiya Kishor
                </div>
            </div>
        </div>
    );
};

export default Signup;
