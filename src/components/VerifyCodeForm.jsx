import { useState, useRef, useEffect } from 'react';
import { verifyCodeApi } from '../api/auth';
import logo from '../assets/logo.svg';

export default function VerifyCodeForm({ onSuccess, onBack }) {
    const inputRef = useRef(null);
    const verifyPendingRef = useRef(false);

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showGetNewButton, setShowGetNewButton] = useState(false);
    const [getNewButtonDisabled, setGetNewButtonDisabled] = useState(false);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGetNewButton(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (code.length === 6 && !verifyPendingRef.current) {
            verifyPendingRef.current = true;

            (async () => {
                setIsLoading(true);
                setError('');

                try {
                    await verifyCodeApi(code);
                    setIsVerified(true);
                } catch {
                    setError('Invalid code');
                } finally {
                    setIsLoading(false);
                    verifyPendingRef.current = false;
                }
            })();
        }
    }, [code]);



    useEffect(() => {
        if (error && inputRef.current) {
            inputRef.current.focus();
        }
    }, [error]);

    const handleCodeChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) {
            return;
        }
        if (value.length <= 6) {
            setCode(value);
            setError('');
        }
    };

    const handleCodeBoxesClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleContinue = () => {
        alert('Verification successful!');
        onSuccess();
    };

    const handleGetNewCode = () => {
        setCode('');
        setError('');
        setIsVerified(false);
        setShowGetNewButton(false);
        setGetNewButtonDisabled(true);
        verifyPendingRef.current = false;

        setTimeout(() => {
            setGetNewButtonDisabled(false);
            setShowGetNewButton(true);
        }, 15000);

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const codeDigits = code.split('').concat(Array(6 - code.length).fill(''));

    return (
        <div className="form-wrapper verify-form-wrapper">
            <div className="verify-form-header">
                <button
                    onClick={onBack}
                    className="back-button-icon"
                    disabled={isLoading}
                    title="Back to Login"
                >
                    ←
                </button>

                <div className="logo-container">
                    <img src={logo} alt="Company logo" className="logo" />
                </div>

                <h2>Two-Factor Authentication</h2>
                <p className="description">
                    Enter the 6-digit code from the Google Authenticator app
                </p>
            </div>

            <form>
                <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    maxLength="6"
                    disabled={isLoading}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        opacity: 0,
                        pointerEvents: 'none'
                    }}
                />

                <div
                    className={`code-boxes ${error ? 'code-boxes-error' : ''}`}
                    onClick={handleCodeBoxesClick}
                >
                    {codeDigits.map((digit, index) => (
                        <div
                            key={index}
                            className={`code-box ${digit ? 'filled' : ''}`}
                        >
                            {digit}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="error-box">
                        <span className="error-text">{error}</span>
                    </div>
                )}

                {isVerified ? (
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="submit-button"
                    >
                        Continue
                    </button>
                ) : isLoading && (
                    <button
                        type="button"
                        disabled
                        className="submit-button"
                    >
                        Verifying...
                    </button>
                )}
            </form>

            {showGetNewButton && !isVerified && (
                <button
                    onClick={handleGetNewCode}
                    disabled={getNewButtonDisabled || isLoading}
                    className="get-new-button"
                >
                    {getNewButtonDisabled ? 'Requesting new code...' : 'Get new'}
                </button>
            )}
        </div>
    );
}
