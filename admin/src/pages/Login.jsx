import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/adminAuthSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            // API call simulation - replace with actual API
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                dispatch(loginSuccess({ user: data.user, token: data.token }));
                navigate('/admin/dashboard');
            } else {
                dispatch(loginFailure(data.message));
            }
        } catch (error) {
            dispatch(loginFailure('Login failed. Please try again.'));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-8 text-3xl font-bold text-center text-gray-900">
                    Admin Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;