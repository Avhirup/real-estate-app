import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// *********************************TESTING PURPOSE***************************************
import { NavContext } from '../context/NavContex';
// *********************************TESTING PURPOSE***************************************
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

export default function SignUp() {
  //* ***************************** TESTING PURPOSE OF WORKING NAVBAR****************************
  const { value, setValue } = useContext(NavContext);
  //* ***************************** TESTING PURPOSE OF WORKING NAVBAR****************************
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // ---------------- Storing the email password in auth ------------------
      const auth = getAuth();
      if (name === '') {
        const error = new Error('Name is missing');
        error.code = 'name_is_missing';
        throw error;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      toast.success('Successfully registered; please sign in');
      // ---------------- ---------------------------------- ------------------

      // ------------------ Storing the user information (name, email) in DB --------------
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formDataCopy);
      // ------------------ ------------------------------------------------ --------------
      setValue(2);
      navigate('/sign-in');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('User already exists');
      } else if (err.code === 'auth/weak-password') {
        toast.error('Please enter a strong password');
      } else if (err.code === 'auth/missing-password') {
        toast.error('Please enter a password');
      } else if (err.code === 'name_is_missing') {
        toast.error('Please enter your name');
      } else if (err.code === 'auth/missing-email') {
        toast.error('Please enter your email');
      } else {
        toast.error('Something went wrong');
      }
      console.log(err.code);
    }
  };

  return (
    <div className="container">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
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
              Your Name
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="John Doe"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              value={name}
              onChange={onChange}
              id="name"
            />
            <Typography
              variant="h6"
              color="blue-gray"
              className="-mb-3 font-semibold"
            >
              Your Email
            </Typography>
            <Input
              size="lg"
              type="email"
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
            sign up
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{' '}
            {/* <a
              className="font-medium text-gray-900"
              onClick={() => navigate('/sign-in')}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </a> */}
            <Link
              to="/sign-in"
              className="font-medium text-gray-900"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}
