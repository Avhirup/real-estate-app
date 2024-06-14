import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

// --------------------------- Test ------------------------------ //
import { NavContext } from '../context/NavContex';
import { Card, Input, Button, Typography } from '@material-tailwind/react';

// -------------------------------------------------------------- //

//! --------------------- Trying to implement Private Route -------------------
import { useAuthStatus } from '../Hooks/useAuthStatus';
import ProfileLoading from '../skeleton/ProfileLoading';
import { Navigate } from 'react-router-dom';
//! --------------------- Trying to implement Private Route -------------------

export default function ForgotPassword() {
  //! --------------------- Trying to implement Private Route -------------------
  const { loggedIn, checkingStatus } = useAuthStatus();
  //! --------------------- Trying to implement Private Route -------------------

  const nagivate = useNavigate();
  const [email, setEmail] = useState('');
  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email === '') {
      toast.info('Please enter your email');
      return;
    }
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset link was successfully sent to your email');
      nagivate('/sign-in');
      setTimeout(() => {
        toast.success(
          'Please check your email and set a new password for your account'
        );
      }, 1670);
    } catch (err) {
      if (err.code == 'auth/invalid-email')
        toast.error('The email you provided is invalid');
      else toast.error('Could not send the reset link!');
      // console.log(err);
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
    <div className="container  mt-10 mb-5">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Forgot Password
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter your email to get the reset link.
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
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
          </div>

          <Button className="mt-7" fullWidth type="submit">
            Get link
          </Button>
          <Typography color="gray" className="mt-6 text-center font-normal">
            Sign in to your account{'  '}
            <Link
              to="/sign-in"
              className="font-medium text-gray-900"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </Link>
          </Typography>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Create new account{'  '}
            <Link
              to="/sign-up"
              className="font-medium text-gray-900"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign Up
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}
