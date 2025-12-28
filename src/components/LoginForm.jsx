import { useState } from 'react';
import { loginApi } from '../api/auth';
import logo from '../assets/logo.svg';

export default function LoginForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
    };

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await loginApi(formData.email, formData.password);
            onSuccess();
        } catch (err) {
            if (err.status === 403) {
                setError('User is blocked');
            } else if (err.status === 401) {
                setError('Wrong password or email');
            } else if (err.status === 500) {
                setError('Server error');
            } else if (err.status === 0) {
                setError('Network error');
            } else {
                setError(err.message || 'An error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <div className="logo-container">
                <img src={logo} alt="Company logo" className="logo" />
            </div>

            <h2>Sign in to your account to continue</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            disabled={isLoading}
                            className={error ? 'input-error' : ''}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            disabled={isLoading}
                            className={error ? 'input-error' : ''}
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-box">
                        <span className="error-text">{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="submit-button"
                >
                    {isLoading ? 'Loading...' : 'Log in'}
                </button>
            </form>
        </div>
    );
}
