import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
    const { user, updateProfile, loading } = useAuth();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        currency: '₹',
        password: '',
        repeat_password: ''
    });

    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstName || '',
                lastname: user.lastName || '',
                currency: user.currency || '₹',
                password: '',
                repeat_password: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (formData.password && formData.password !== formData.repeat_password) {
            setMessage({ type: 'error', text: '❌ Passwords do not match.' });
            return;
        }

        const res = await updateProfile(formData);
        if (res.success) {
            setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
            setFormData((prev) => ({ ...prev, password: '', repeat_password: '' }));
        } else {
            setMessage({ type: 'error', text: `❌ ${res.message}` });
        }
    };

    return (
        <div>
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <h1>
                        <i className="fas fa-user-cog"></i> Manage Account
                    </h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ maxWidth: '600px', background: '#fff', border: '1px solid #43a047', borderRadius: '4px', overflow: 'hidden' }}>
                        <h2 style={{ backgroundColor: '#43a047', color: 'white', padding: '12px 20px', margin: 0, fontSize: '18px' }}>
                            <i className="fas fa-user-edit"></i> Edit Profile
                        </h2>

                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <label>First Name</label>
                            <input
                                type="text"
                                value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                required
                            />

                            <label>Last Name</label>
                            <input
                                type="text"
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                required
                            />

                            <label>Currency Symbol</label>
                            <input
                                type="text"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                required
                            />

                            <label>Password (leave blank to keep unchanged)</label>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />

                            <label>Repeat Password</label>
                            <input
                                type="password"
                                placeholder="Repeat New Password"
                                value={formData.repeat_password}
                                onChange={(e) => setFormData({ ...formData, repeat_password: e.target.value })}
                                style={{ width: '100%', padding: '8px 10px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#43a047',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fas fa-save"></i> Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
