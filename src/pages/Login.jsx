import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect, useNavigate } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
// import Spline from '@splinetool/react-spline';  // Commented out Spline import

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await customFetch.post('/auth/local', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    toast.success('Logged in successfully');
    return redirect('/dashboard');
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      'Please double-check your credentials';
    toast.error(errorMessage);
    return null;
  }
};

const Login = () => {
  const navigate = useNavigate();

  const loginAsGuestUser = async () => {
    try {
      const response = await customFetch.post('/auth/local', {
        identifier: 'test@test.com',
        password: 'secret',
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Welcome guest user');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error('Guest user login error. Please try again.');
    }
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-base-200">
      {/* Left Column - Spline 3D Model */}
      <div className="w-full md:w-1/2 h-[30vh] md:h-screen bg-base-300 relative overflow-hidden">
        {/* Spline component commented out
        <Spline
          scene="https://prod.spline.design/YOUR_SPLINE_SCENE_ID/scene.splinecode"
          className="w-full h-full"
        />
        */}
        {/* Fallback for mobile or if Spline fails to load */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-primary">
            CodeRuBoiz
          </h1>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Welcome Back
          </h2>

          <Form method="post" className="flex flex-col gap-y-4">
            <FormInput type="email" label="Email" name="identifier" />
            <FormInput type="password" label="Password" name="password" />

            <div className="mt-6">
              <SubmitBtn text="Login" className="btn-primary w-full" />
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-block mt-3"
              onClick={loginAsGuestUser}
            >
              Guest User
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline gap-2"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login with Google
            </button>

            <p className="text-center mt-4 text-gray-600">
              Not a member yet?{' '}
              <Link
                to="/register"
                className="ml-1 text-primary hover:text-primary-focus font-medium"
              >
                Register
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;