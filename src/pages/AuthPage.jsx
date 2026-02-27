import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setAuthError('');

        try {
            if (isLogin) {
                await login(data.email, data.password);
            } else {
                await signup(data.email, data.password, data.name);
            }
            navigate('/dashboard');
        } catch (error) {
            setAuthError(error.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setAuthError('');
        reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isLogin ? 'Sign in to manage your finances' : 'Start tracking your expenses today'}
                    </p>
                </div>

                {/* Error Message */}
                {authError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {authError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name (Signup only) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                {...register('name', { 
                                    required: 'Name is required'
                                })}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            {...register('email', { 
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            {...register('password', { 
                                required: 'Password is required',
                                minLength: {
                                    value: 4,
                                    message: 'Password must be at least 4 characters'
                                }
                            })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password (Signup only) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword', { 
                                    required: 'Please confirm your password',
                                    validate: (value, formValues) => 
                                        value === formValues.password || 'Passwords do not match'
                                })}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="w-full mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {isLogin ? 'Signing in...' : 'Creating account...'}
                            </span>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </Button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button 
                            type="button"
                            onClick={toggleMode}
                            className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    By continuing, you agree to our Terms and Privacy Policy.
                </p>
            </Card>
        </div>
    );
}