import { useState } from 'react';
import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await customFetch.post('/auth/local/register', data);
    toast.success('account created successfully');
    return redirect('/login');
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      'please double check your credentials';
    toast.error(errorMessage);
    return null;
  }
};

const Register = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSendVerification = async () => {
    if (!mobileNumber) return;
    
    try {
      // Replace with your actual verification API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowVerification(true);
      toast.success('Verification code sent');
    } catch (error) {
      toast.error('Failed to send verification code');
    }
  };

  const handleGoogleLogin = () => {
    // Replace with your actual Google auth URL
    window.location.href = `/api/auth/google`;
  };

  return (
    <section className='min-h-screen flex items-center justify-center bg-gradient-to-b from-base-200 to-base-300 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full bg-white shadow-xl rounded-xl p-8 transition-all duration-300 hover:shadow-2xl'>
        <h2 className='text-center text-3xl font-extrabold text-gray-900 mb-6'>
          Create Your Account
        </h2>
        
        <Form method='POST' className='flex flex-col gap-y-4'>
          <FormInput 
            type='text' 
            label='Username' 
            name='username' 
            containerStyles='border-b border-gray-300 focus-within:border-primary transition-colors'
            inputStyles='focus:ring-0'
          />
          
          <FormInput 
            type='email' 
            label='Email' 
            name='email' 
            containerStyles='border-b border-gray-300 focus-within:border-primary transition-colors'
            inputStyles='focus:ring-0'
          />
          
          <FormInput 
            type='password' 
            label='Password' 
            name='password'
            containerStyles='border-b border-gray-300 focus-within:border-primary transition-colors'
            inputStyles='focus:ring-0'
          />
          
          <div className='form-control mt-2'>
            <label className='label'>
              <span className='label-text text-gray-700'>Mobile Number (Optional)</span>
            </label>
            <div className='flex gap-2'>
              <input
                type='tel'
                className='input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary'
                name='mobile'
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder='+1 (555) 000-0000'
              />
              <button
                type='button'
                className={`btn btn-sm ${showVerification ? 'btn-success' : 'btn-outline btn-primary'}`}
                onClick={handleSendVerification}
                disabled={!mobileNumber || showVerification}
              >
                {showVerification ? 'Sent' : 'Verify'}
              </button>
            </div>
          </div>
          
          {showVerification && (
            <FormInput
              type='text'
              label='Verification Code'
              name='verificationCode'
              containerStyles='border-b border-gray-300 focus-within:border-primary transition-colors'
              inputStyles='focus:ring-0'
            />
          )}
          
          <div className='mt-6'>
            <SubmitBtn 
              text='Register' 
              className='btn-primary w-full text-lg capitalize tracking-wide hover:brightness-110 transition-all duration-300' 
            />
          </div>
          
          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>
          
          <button
            type='button'
            className='btn btn-outline btn-neutral gap-2 hover:bg-gray-100 transition-colors duration-300'
            onClick={handleGoogleLogin}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Register with Google
          </button>
          
          <p className='text-center mt-4 text-gray-600'>
            Already a member?
            <Link
              to='/login'
              className='ml-1 text-primary hover:text-primary-focus font-medium'
            >
              Login
            </Link>
          </p>
        </Form>
      </div>
    </section>
  );
};

export default Register;