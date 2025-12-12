import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Building2, Shield, Users, TrendingUp } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateForm = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        setError('');

        // Simulate login API call
        setTimeout(() => {
            if (formData.email === 'admin@example.com' && formData.password === 'adminpass') {
                alert('Login successful! Redirecting to dashboard...');
                setLoading(false);
            } else {
                setError('Invalid email or password. Please try again.');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Company Branding */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"></div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full w-96 h-96 translate-x-1/3 translate-y-1/3"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    {/* Logo & Company Name */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl bg-opacity-20 backdrop-blur-sm">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">TechCorp Solutions</h1>
                                <p className="text-sm text-blue-100">Enterprise Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-md">
                        <h2 className="mb-4 text-4xl font-bold leading-tight">
                            Welcome to Your Admin Dashboard
                        </h2>
                        <p className="mb-8 text-lg text-blue-100">
                            Manage your business operations efficiently with our comprehensive admin panel.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl bg-opacity-10 backdrop-blur-sm">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-lg bg-opacity-20">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Secure & Reliable</h3>
                                    <p className="text-sm text-blue-100">Enterprise-grade security for your data</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl bg-opacity-10 backdrop-blur-sm">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-lg bg-opacity-20">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Team Management</h3>
                                    <p className="text-sm text-blue-100">Collaborate with your team seamlessly</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl bg-opacity-10 backdrop-blur-sm">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-lg bg-opacity-20">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Analytics & Insights</h3>
                                    <p className="text-sm text-blue-100">Track performance with real-time data</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-sm text-blue-100">
                        © 2024 TechCorp Solutions. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center w-full px-6 py-12 bg-gray-50 lg:w-1/2 sm:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 lg:hidden">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                                <Building2 className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">TechCorp Solutions</h1>
                                <p className="text-xs text-gray-600">Enterprise Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                        <p className="mt-2 text-gray-600">Welcome back! Please enter your credentials</p>
                    </div>

                    {/* Login Form */}
                    <div className="p-8 bg-white shadow-xl rounded-2xl">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800">Login Failed</p>
                                    <p className="mt-1 text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${validationErrors.email
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${validationErrors.password
                                                ? 'border-red-300 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => alert('Password reset functionality coming soon!')}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>

                        {/* Demo Credentials */}
                        <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
                            <p className="mb-2 text-sm font-medium text-blue-900">Demo Credentials:</p>
                            <div className="space-y-1 text-sm text-blue-700">
                                <p>Email: admin@example.com</p>
                                <p>Password: adminpass</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;