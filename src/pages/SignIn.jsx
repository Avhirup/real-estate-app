import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
// *********************************TESTING PURPOSE***************************************
import { NavContext } from '../context/NavContex';
// *********************************TESTING PURPOSE***************************************
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react';

import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import GoogleOAuth from '../components/OAuths/GoogleOAuth';
import { ImAppleinc } from 'react-icons/im';
import { RiFacebookBoxFill } from 'react-icons/ri';

//! --------------------- Trying to implement Private Route -------------------
import { useAuthStatus } from '../Hooks/useAuthStatus';
import ProfileLoading from '../skeleton/ProfileLoading';
import { Navigate } from 'react-router-dom';
//! --------------------- Trying to implement Private Route -------------------

export default function SignIn() {
  //! --------------------- Trying to implement Private Route -------------------
  const { loggedIn, checkingStatus } = useAuthStatus();
  //! --------------------- Trying to implement Private Route -------------------

  //* ***************************** TESTING PURPOSE OF WORKING NAVBAR****************************
  const { value, setValue } = useContext(NavContext);
  //* ***************************** TESTING PURPOSE OF WORKING NAVBAR****************************
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        toast.success(`Welcome back, ${auth.currentUser.displayName}`);
        setValue(0);
        navigate('/');
      }
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (err.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password');
      } else {
        toast.error('Bad request');
      }
      console.log(err);
    }
  };

  //! --------------------- Trying to implement Private Route -------------------
  if (checkingStatus) {
    return <ProfileLoading />;
  }
  if (loggedIn) return <Navigate to="/profile" />;
  else <Navigate to="/sign-in" />;
  //! --------------------- Trying to implement Private Route -------------------

  return (
    <div className="container">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Welcome! Enter your details to log in.
        </Typography>
        <form
          className="mt-8 mb-6 w-80 max-w-screen-lg sm:w-96"
          onSubmit={onSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-semibold"
            >
              Your Email
            </Typography>
            <Input
              type="email"
              size="lg"
              placeholder="johndoe@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={email}
              onChange={onChange}
              id="email"
            />
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-semibold"
            >
              Password
            </Typography>
            <Input
              type={showPassword ? 'text' : 'password'}
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={password}
              onChange={onChange}
              id="password"
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                Show Password
              </Typography>
            }
            containerProps={{ className: '-ml-2.5' }}
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
          <Button className="mt-5" fullWidth type="submit">
            sign in
          </Button>
          <Typography color="gray" className="mt-6 text-center font-normal">
            Don't remember the password?{' '}
            <Link
              to="/forgot-password"
              className="font-medium text-gray-900"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forgot Password
            </Link>
          </Typography>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Create new account{' '}
            <Link
              to="/sign-up"
              className="font-medium text-gray-900"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign Up
            </Link>
          </Typography>
        </form>
        <Divider style={{ marginBottom: '.5rem' }}>
          <Chip label="or" size="large" />
        </Divider>
        <div
          className="container mt-4 mb-4"
          style={{ display: 'flex', flexDirection: 'row', gap: '3rem' }}
        >
          <GoogleOAuth />
          <RiFacebookBoxFill
            onClick={() => {
              toast('Feature coming soon');
            }}
            size={'2.5rem'}
            style={{ cursor: 'pointer', color: '#3b5998' }}
          />
          <ImAppleinc
            onClick={() => {
              toast('Feature coming soon');
            }}
            size={'2.1rem'}
            style={{ cursor: 'pointer', color: '#A2AAAD' }}
          />
        </div>
      </Card>
    </div>
  );
}
