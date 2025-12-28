import { useState } from 'react';
import LoginForm from './LoginForm';
import VerifyCodeForm from './VerifyCodeForm';

export default function AuthContainer() {
  const [stage, setStage] = useState('login');

  const handleLoginSuccess = () => {
    setStage('verify');
  };

  const handleVerifySuccess = () => {
    setStage('login');
  };

  return (
    <div className="app">
      <div className="app-content">
        <div className="auth-container">
          {stage === 'login' && (
            <LoginForm onSuccess={handleLoginSuccess} />
          )}
          {stage === 'verify' && (
            <VerifyCodeForm
              onSuccess={handleVerifySuccess}
              onBack={() => setStage('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
