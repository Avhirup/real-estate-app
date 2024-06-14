import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ProfileLoading from '../skeleton/ProfileLoading';
import { toast } from 'react-toastify';
import '../App.css';

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react';
// import { Select, Option } from '@material-tailwind/react';

//********************** TESTING ********************** */
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CreateListing() {
  const [geoLocationEnable, setGeoLocationEnable] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    location: '',
    offer: false,
    regularPrice: 999,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    wifi: false,
  });

  // destructuring form data
  const {
    type,
    name,
    description,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    location,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
    wifi,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const _isMounted = useRef(true);

  // const onChange = (e) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    toast(`Submitted : ${type}`);
  };

  useEffect(() => {
    if (_isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, useRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      _isMounted.current = false;
    };
  }, [_isMounted]);

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <div className="container mt-10 mb-5">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          List your property for sale or rent
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          To register, provide information about your property.
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={onSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            {/* --------------- Name --------------- */}
            <div className="name w-full">
              <Input
                label="Name"
                required
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                size="lg"
                placeholder="Name of the Post"
                maxLength={80}
                minLength={3}
              />
            </div>
            {/* --------------- Description --------------- */}
            <div className="description">
              <Input
                label="Description"
                type="text"
                name="description"
                value={description}
                onChange={onChange}
                size="lg"
                placeholder="Write something about your property"
                maxLength={150}
                minLength={10}
              />
            </div>

            {/* --------------- Sell / Rent --------------- */}
            {/* <div className="sell-rent">
              <Select
                name="type"
                label="Sell / Rent"
                value={type}
                onChange={onChange}
              >
                <Option name="type" value="rent">
                  Renting
                </Option>
                <Option name="type" value="sale">
                  Selling
                </Option>
              </Select>
            </div> */}

            {/* ------------------ MATERIAL UI ----------------- */}
            <div>
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#212121',
                    '&.Mui-focused fieldset': {
                      borderColor: '#212121',
                    },
                    '&:hover fieldset': {
                      borderColor: '#212121',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#212121',
                    '&.Mui-focused': {
                      color: '#212121',
                    },
                  },
                }}
              >
                <InputLabel id="sale-rent" required>
                  Sell / Rent
                </InputLabel>
                <Select
                  labelId="sale-rent"
                  name="type"
                  value={type}
                  label="Sell / Rent"
                  onChange={onChange}
                >
                  <MenuItem value="rent">Renting</MenuItem>
                  <MenuItem value="sale">Selling</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Create Post
          </Button>
        </form>
      </Card>
    </div>
  );
}

/*
<Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
*/
