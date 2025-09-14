'use client'
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button';
import { SEND_CODE_FORGOT_PASSWORD_API, FORGOT_PASSWORD_API } from '@/api/api';

// Component 1: Send Code Component
const SendCodeComponent = ({ onEmailSubmit }: { onEmailSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // API call commented out for now
      const response = await fetch(SEND_CODE_FORGOT_PASSWORD_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      // return response.json();
      await response.json();
      // console.log("data", data);

      if (!response.ok) {
        throw new Error('Failed to send verification code');
        return { success: false, message: 'Failed to send verification code' };
      }

      // console.log('SendCodeComponent - Email submitted:', email);
      toast.success('Verification code sent to your email!');

      // Update URL with email parameter
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('email', email);
      window.history.pushState({}, '', currentUrl.toString());

      // Call parent function to update URL and move to next step
      onEmailSubmit(email);

    } catch (error) {
      console.error('Error sending code:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="p-3 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
          <Mail className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">Enter your email to receive a verification code</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className='w-full py-2.5'
          variant='primary'
        >
          {isLoading ? 'Sending Code...' : 'Send Verification Code'}
        </Button>
      </form>
    </div>
  );
};

// Component 2: Verification Code Component
const VerificationCodeComponent = ({
  email,
  onCodeSubmit
}: {
  email: string;
  onCodeSubmit: (code: string) => void;
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    if (code.length < 4) {
      toast.error('Please enter a valid verification code');
      return;
    }

    setIsLoading(true);

    try {
      // API call commented out for now
      // const response = await fetch('/api/forgot-password/verify-code', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, code }),
      // });

      // if (!response.ok) {
      //   throw new Error('Invalid verification code');
      // }

      // console.log('VerificationCodeComponent - Code submitted:', { email, code });
      toast.success('Code verified successfully!');

      // Call parent function to update URL and move to next step
      onCodeSubmit(code);

    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">We&apos;ve sent a code to {email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-center text-2xl placeholder:text-lg font-mono tracking-widest"
            placeholder="Enter verification code"
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className='w-full py-3.5'
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </form>
    </div>
  );
};

// Component 3: Reset Password Component
const ResetPasswordComponent = ({
  email,
  code
}: {
  email: string;
  code: string;
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to reset password
      const response = await fetch(FORGOT_PASSWORD_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          code,
          email,
          password: newPassword,
          password_confirmation: confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (data.message) {
          toast.error(data.message);
        } else if (data.error && typeof data.error === 'object' && data.error.message) {
          toast.error(data.error.message);
        } else {
          toast.error('Failed to reset password');
        }
        return;
      }
      toast.success('Password reset successfully!');

      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="p-3 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
          <Lock className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">Enter your new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Confirm new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

// Main Forget Password Page Component
const ForgetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get email and code from URL parameters
  const emailFromUrl = searchParams.get('email');
  const codeFromUrl = searchParams.get('code');

  // Determine which step to show
  const getCurrentStep = () => {
    if (emailFromUrl && codeFromUrl) return 3;
    if (emailFromUrl) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  const handleEmailSubmit = (email: string) => {
    // Update URL with email parameter
    const newUrl = `/forget-password?email=${encodeURIComponent(email)}`;
    router.push(newUrl);
  };

  const handleCodeSubmit = (code: string) => {
    // Update URL with both email and code parameters
    const newUrl = `/forget-password?email=${encodeURIComponent(emailFromUrl!)}&code=${encodeURIComponent(code)}`;
    router.push(newUrl);
  };

  return (
    <div className="py-20  container mx-auto  p-4">
      {/* Back Button */}
      <Button
        variant='secondary'
        onClick={() => router.back()}
        className="mb-6 flex border  items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>
      <div className='flex items-center justify-center w-full'>
        <div className="w-full max-w-md">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                    }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Render appropriate component based on current step */}
          {currentStep === 1 && (
            <SendCodeComponent onEmailSubmit={handleEmailSubmit} />
          )}

          {currentStep === 2 && emailFromUrl && (
            <VerificationCodeComponent
              email={emailFromUrl}
              onCodeSubmit={handleCodeSubmit}
            />
          )}

          {currentStep === 3 && emailFromUrl && codeFromUrl && (
            <ResetPasswordComponent
              email={emailFromUrl}
              code={codeFromUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
