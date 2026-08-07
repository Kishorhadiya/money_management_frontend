import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }
    const { requestOtp, resetPassword } = useAuth();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage(null);

        const res = await requestOtp(email);
        if (res.success) {
            setMessage({
                type: 'success',
                text: `OTP sent! Use this OTP: ${res.data.otp}`
            });
            setStep(2);
        } else {
            setMessage({ type: 'error', text: res.message });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage(null);

        const res = await resetPassword(email, otp, newPassword);
        if (res.success) {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setStep(1);
            setEmail('');
            setOtp('');
            setNewPassword('');
        } else {
            setMessage({ type: 'error', text: res.message });
        }
    };

    return (
        <div className="auth-bg">
            <div className="form-container">
                <div className="form-header red">🔐 Forgot Password</div>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="red-btn">
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleUpdatePassword}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="red-btn">
                            Update Password
                        </button>
                    </form>
                )}

                <div className="page-link">
                    <Link to="/login">Back to Login</Link>
                </div>

                <div className="footer">
                    &copy; 2025 Money Manager <br /> Developed by Hadiya Kishor
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
