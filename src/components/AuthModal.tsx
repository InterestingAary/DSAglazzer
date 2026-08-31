import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, GitBranch, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'signin' }) => {
  const { signUp, signIn, signInWithOAuth, resetPassword } = useAuth();
  const { syncFromCloud } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result: { error: Error | null } = { error: null };

      if (mode === 'signup') {
        result = await signUp(email, password, name);
        if (!result.error) {
          setSuccess('Account created! Please check your email to verify.');
          setMode('signin');
        }
      } else if (mode === 'signin') {
        result = await signIn(email, password);
        if (!result.error) {
          await syncFromCloud();
          onClose();
        }
      } else if (mode === 'forgot') {
        result = await resetPassword(email);
        if (!result.error) {
          setSuccess('Password reset email sent!');
          setMode('signin');
        }
      }

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    setLoading(true);
    const result = await signInWithOAuth(provider);
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-[var(--color-deep)]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative card max-w-md w-full p-6"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
            {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {mode === 'signup'
              ? 'Start your DSA mastery journey'
              : mode === 'forgot'
              ? 'Enter your email to receive a reset link'
              : 'Continue your DSA practice'}
          </p>
        </div>

        {error && (
          <motion.div
            className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-accent-danger)]/10 border border-[var(--color-accent-danger)]/20 text-[var(--color-accent-danger)] text-sm mb-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-accent-emerald)]/10 border border-[var(--color-accent-emerald)]/20 text-[var(--color-accent-emerald)] text-sm mb-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'signup' || mode === 'signin') && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Name
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full pl-10"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {(mode === 'signup' || mode === 'signin') && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'forgot' && (
            <p className="text-sm text-[var(--color-text-muted)]">
              We'll send a password reset link to your email.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || (mode !== 'forgot' && !password) || (mode === 'signup' && !name)}
            className="w-full btn btn-primary py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mode === 'signup' ? 'Creating account...' : mode === 'forgot' ? 'Sending...' : 'Signing in...'}</span>
              </>
            ) : (
              mode === 'signup'
                ? 'Create Account'
                : mode === 'forgot'
                ? 'Send Reset Link'
                : 'Sign In'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--color-surface)] text-[var(--color-text-muted)]">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={loading}
            className="btn btn-ghost flex items-center justify-center gap-2 py-2.5"
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={loading}
            className="btn btn-ghost flex items-center justify-center gap-2 py-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          {mode === 'signup' ? "Already have an account?" : mode === 'forgot' ? 'Remember your password?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : mode === 'forgot' ? 'signin' : 'signup');
              setError(null);
              setSuccess(null);
            }}
            className="ml-1 text-[var(--color-accent)] font-semibold hover:underline"
          >
            {mode === 'signup' ? 'Sign In' : mode === 'forgot' ? 'Back to Sign In' : 'Sign Up'}
          </button>
        </p>

        {mode === 'signin' && (
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="text-[var(--color-accent)] font-semibold hover:underline"
            >
              Forgot password?
            </button>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};