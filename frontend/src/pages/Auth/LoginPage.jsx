import React, {useContext, useState }from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import {Link, useNavigate} from 'react-router';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const LoginPage = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState(null);

  const  { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  //handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError('Please enter a valid email address');
      return;
    }

    if(!password){
      setError('Please enter your password');
      return;
    }

    // if(password.length < 8){
    //   setError('Password must be at least 8 characters long');
    //   return;
    // }

    setError(null);

    //LoginAPI Call here
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else{
        setError("Something went wrong. Please try again");
      }
      
    }

  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-bold text-black'> Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            required
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="Password"
            placeholder="Min 8 characters"
            required
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Log In
          </button> 

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{' '}
            <Link className="font-medium text-primary underline " to='/signup'>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default LoginPage