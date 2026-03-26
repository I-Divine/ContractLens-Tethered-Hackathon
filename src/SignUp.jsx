import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell app-container grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="panel panel--soft p-8 reveal">
        <div className="flex items-center gap-3 mb-6">
          <div className="logo-badge">
            <img src="/contractLensLogo.png" alt="ContractLens logo" className="logo-image" />
          </div>
          <div>
            <p className="text-xl font-bold">ContractLens</p>
            <p className="text-sm text-gray-600">Contract clarity in minutes</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Create your account</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">Start analyzing contracts with confidence today.</p>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Email</label>
            <input
              className="input-field w-full disabled:bg-gray-50 disabled:cursor-not-allowed"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Password</label>
            <div className="input-group">
              <input
                className="input-field w-full has-toggle disabled:bg-gray-50 disabled:cursor-not-allowed"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.7 10.7a3 3 0 0 0 4.2 4.2M9.88 5.09A10.9 10.9 0 0 1 12 5c5.5 0 9.5 4.5 9.5 7-.4 1.1-1.1 2.4-2.2 3.5M6.5 6.5C4.4 7.9 3 9.8 2.5 12c.8 2.3 3.9 7 9.5 7 1 0 2-.1 2.9-.4"
                    />
                  </svg>
                ) : (
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12C3.8 8.2 7.6 5 12 5s8.2 3.2 9.5 7c-1.3 3.8-5.1 7-9.5 7s-8.2-3.2-9.5-7Z"
                    />
                    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Confirm Password</label>
            <div className="input-group">
              <input
                className="input-field w-full has-toggle disabled:bg-gray-50 disabled:cursor-not-allowed"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M10.7 10.7a3 3 0 0 0 4.2 4.2M9.88 5.09A10.9 10.9 0 0 1 12 5c5.5 0 9.5 4.5 9.5 7-.4 1.1-1.1 2.4-2.2 3.5M6.5 6.5C4.4 7.9 3 9.8 2.5 12c.8 2.3 3.9 7 9.5 7 1 0 2-.1 2.9-.4"
                    />
                  </svg>
                ) : (
                  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12C3.8 8.2 7.6 5 12 5s8.2 3.2 9.5 7c-1.3 3.8-5.1 7-9.5 7s-8.2-3.2-9.5-7Z"
                    />
                    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">Sign In</Link>
        </p>
      </div>
      <div className="panel panel--dark p-8 reveal reveal-2">
        <h3 className="text-2xl font-bold mb-4">Why teams choose ContractLens</h3>
        <p className="text-blue-100 mb-6 leading-relaxed">
          Move faster with AI-driven contract insights that keep stakeholders aligned
          and risks visible.
        </p>
        <ul className="space-y-3">
          <li className="glass-pill">Surface hidden liabilities</li>
          <li className="glass-pill">Summaries for non-lawyers</li>
          <li className="glass-pill">Confidence before you sign</li>
        </ul>
      </div>
    </div>
  );
};

export default SignUp;
