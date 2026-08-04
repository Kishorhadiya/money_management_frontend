import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('userInfo');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('userInfo', JSON.stringify(user));
        } else {
            localStorage.removeItem('userInfo');
        }
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await API.post('/auth/login', { email, password });
            setUser(data);
            setLoading(false);
            return { success: true, data };
        } catch (error) {
            setLoading(false);
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const signup = async (formData) => {
        setLoading(true);
        try {
            const { data } = await API.post('/auth/signup', formData);
            setUser(data);
            setLoading(false);
            return { success: true, data };
        } catch (error) {
            setLoading(false);
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async (formData) => {
        setLoading(true);
        try {
            const { data } = await API.put('/auth/settings', formData);
            setUser(data);
            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            setLoading(false);
            const message = error.response?.data?.message || 'Update failed';
            return { success: false, message };
        }
    };

    const requestOtp = async (email) => {
        try {
            const { data } = await API.post('/auth/forgot-password', { email });
            return { success: true, data };
        } catch (error) {
            const message = error.response?.data?.message || 'Request failed';
            return { success: false, message };
        }
    };

    const resetPassword = async (email, otp, new_password) => {
        try {
            const { data } = await API.post('/auth/verify-otp', { email, otp, new_password });
            return { success: true, message: data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Reset failed';
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                updateProfile,
                requestOtp,
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
