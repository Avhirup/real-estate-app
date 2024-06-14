import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { db } from '../firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Card, Button, Typography } from '@material-tailwind/react';

//********************** TESTING ********************** */
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ButtonLoading } from '../skeleton/ButtonLoading';

export default function CreateListing() {
  // !----------------- API Key ------------------
  const geoCodingApiKey = import.meta.env.VITE_GEOCODE_API_KEY;
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
    wifi: false,
    geolocation: {},
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
    wifi,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const _isMounted = useRef(true);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    //! Checking for discounted price
    if (offer && discountedPrice >= regularPrice) {
      // if (discountedPrice >= regularPrice) {
      toast.error('Dicounted price needs to be less than regular price');
      setLoading(false);
      return;
      // }
    }

    //! Checking if there are more than 6 images
    if (images.length > 6) {
      toast.error('Maximum 6 images can be uploaded');
      // toast.error('Cannot create the post');
      setLoading(false);
      return;
    }

    //! Geocoding - getting lat and lon of the address / location
    let geoLocation = {};
    let actualLocation;
    setLoading(true);
    try {
      const encodedAddress = encodeURIComponent(location);
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${geoCodingApiKey}`;
      var requestOptions = {
        method: 'GET',
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      // ! ----------- Setting up values -------------
      actualLocation =
        data.features.length === 0
          ? undefined
          : data.features[0].properties.formatted;
      if (data.features.length > 0) {
        geoLocation.lat = data.features[0].properties.lat;
        geoLocation.lon = data.features[0].properties.lon;
        // console.log(data.features[0].properties.lat);
        // console.log(data.features[0].properties.lon);
        // console.log(data.features[0].properties.formatted);
      } else {
        throw new Error('Location Invalid');
      }
      // ! ------------- Setting up values ------------------
    } catch (err) {
      // console.log(err);
      toast.error('Invalid address');
      toast.error('Cannot create the post');
      return;
    } finally {
      setLoading(false);
    }

    //! --------- Store images into firebase ----------
    setLoading(true);
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        //todo: getting firebase storage
        const storage = getStorage();
        //todo: creating filename for the image
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        //todo: creating storage reference
        const storageRef = ref(storage, 'images/' + fileName);

        //todo Create the file metadata
        /** @type {any} */
        const metadata = {
          contentType: 'image/jpeg',
        };
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);

        //todo Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                toast.error(
                  "User doesn't have permission to access the object"
                );
                break;
              case 'storage/canceled':
                toast.error('User canceled the upload');
                break;

              case 'storage/unknown':
                toast.error(
                  'Unknown error occurred, inspect error.serverResponse'
                );
                break;
            }
            reject(error);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    //! Calling storeImage function for all the images individually
    //! to upload each image and get its downloadable link
    //! which we will store to firebase storage
    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Something went wrong, images not uploaded!');
      return;
    });

    // console.log(imageUrls);
    //! Making a formDataCopy where only essential things will be there
    const formDataCopy = {
      ...formData,
      imageUrls: imageUrls,
      geolocation: geoLocation,
      timestamp: serverTimestamp(),
      formattedLocation: actualLocation ?? location,
    };

    //! Deleting unnecessary things from formDataCopy
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    toast.success('The post created successfully');
    setLoading(false);
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }

    // Handling file
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length < 1 || files.length > 6) {
        toast.error('You must upload between 1 and 6 images.');
        // return;
      }
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
      return;
    }
    if (!e.target.files)
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: boolean ?? e.target.value,
      }));
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

  // if (loading) {
  //   return <ProfileLoading />;
  // }

  return (
    <div className="profile container">
      {/* <header>
        <p className="pageHeader">Add your property for sale or rent</p>
      </header> */}
      <main>
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            List your property for sale or rent
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            To register, provide information about your property.
          </Typography>
          <form
            onSubmit={onSubmit}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-6">
              {/* ------------------ NAME ---------------- */}
              {/* <TextField
                placeholder="Name of your Post"
                label="Name"
                type="text"
                name="name"
                value={name}
                onChange={onChange}
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
                required
                inputProps={{
                  maxLength: 80,
                  minLength: 3,
                }}
              /> */}
              <div style={{ position: 'relative', zIndex: 0 }}>
                <TextField
                  placeholder="Name of your Post"
                  fullWidth={true}
                  label="Name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#212121',
                      zIndex: 1,
                      '&.Mui-focused fieldset': {
                        borderColor: '#212121',
                      },
                      '&:hover fieldset': {
                        borderColor: '#212121',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#212121',
                      zIndex: 2,
                      backgroundColor: 'transparent',
                      padding: '0 4px', //
                      '&.Mui-focused': {
                        color: '#212121',
                      },
                    },
                  }}
                  required
                  inputProps={{
                    maxLength: 80,
                    minLength: 3,
                  }}
                />
              </div>
              {/* ------------------ DESCRIPTION ---------------- */}
              <div style={{ position: 'relative', zIndex: 0 }}>
                <TextField
                  placeholder="Describe your property (Optional)"
                  fullWidth={true}
                  label="Description"
                  type="text"
                  name="description"
                  value={description}
                  onChange={onChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#212121',
                      zIndex: 1,
                      '&.Mui-focused fieldset': {
                        borderColor: '#212121',
                      },
                      '&:hover fieldset': {
                        borderColor: '#212121',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#212121',
                      zIndex: 2,
                      backgroundColor: 'transparent',
                      padding: '0 4px',
                      '&.Mui-focused': {
                        color: '#212121',
                      },
                    },
                  }}
                  inputProps={{
                    maxLength: 150,
                    minLength: 10,
                  }}
                />
              </div>

              {/* ------------------ SELL / RENT ---------------- */}
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
              {/* ------------------ BEDROOMS & BATHROOMS ---------------- */}
              <div className="flex space-x-4">
                {/* ---------- BEDROOMS ----------- */}
                <FormControl
                  fullWidth
                  className="w-1/2"
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
                  <TextField
                    required
                    name="bedrooms"
                    label="Bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={onChange}
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                    sx={{
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                        {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                    }}
                  />
                </FormControl>

                {/* ---------- BEDROOMS ----------- */}
                <FormControl
                  fullWidth
                  className="w-1/2"
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
                  <TextField
                    required
                    name="bathrooms"
                    label="Bedrooms"
                    type="number"
                    value={bathrooms}
                    onChange={onChange}
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                    sx={{
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                        {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                    }}
                  />
                </FormControl>
              </div>

              {/* ------------------ WIFI & PARKING ---------------- */}
              <div className="flex space-x-4">
                {/* ---------- WIFI ----------- */}
                <FormControl
                  fullWidth
                  className="w-1/2"
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
                  <InputLabel id="isWifi">Free Wi-Fi</InputLabel>
                  <Select
                    id="isWifi"
                    labelId="isWifi"
                    name="wifi"
                    value={wifi}
                    label="Free Wi-Fi"
                    onChange={onChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
                {/* ---------- PARKING ----------- */}
                <FormControl
                  fullWidth
                  className="w-1/2"
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
                  <InputLabel id="isParking">Parking available</InputLabel>
                  <Select
                    id="isParking"
                    labelId="isParking"
                    name="parking"
                    value={parking}
                    label="Parking available"
                    onChange={onChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* ------------------ FURNISHED & OFFER ---------------- */}
              <div className="flex space-x-4">
                {/* ---------- FURNISHED ----------- */}
                <FormControl
                  fullWidth
                  className="w-1/2"
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
                  <InputLabel id="isFurnished">Furnished</InputLabel>
                  <Select
                    id="isFurnished"
                    labelId="isFurnished"
                    name="furnished"
                    value={furnished}
                    label="Furnished"
                    onChange={onChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>

                {/* ---------- OFFER ----------- */}
                <FormControl
                  fullWidth
                  className="w-1/2"
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
                  <InputLabel id="isOffer">Discount available</InputLabel>
                  <Select
                    id="isOffer"
                    labelId="isOffer"
                    name="offer"
                    value={offer} // Assuming you want the same state, if not, create another state for bathrooms
                    label="Discount available"
                    onChange={onChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* ------------------ ADDRESS ---------------- */}
              {/* <TextField
                label="Address"
                type="text"
                name="location"
                value={location}
                onChange={onChange}
                style={{ position: 'relative', zIndex: '-1' }}
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
                required
                inputProps={{
                  maxLength: 80,
                  minLength: 10,
                }}
              /> */}
              <div style={{ position: 'relative', zIndex: 0 }}>
                <TextField
                  placeholder="Full address with Pincode and City name"
                  fullWidth={true}
                  label="Address"
                  type="text"
                  name="location"
                  value={location}
                  onChange={onChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#212121',
                      zIndex: 1,
                      '&.Mui-focused fieldset': {
                        borderColor: '#212121',
                      },
                      '&:hover fieldset': {
                        borderColor: '#212121',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#212121',
                      zIndex: 2,
                      backgroundColor: 'transparent',
                      padding: '0 4px', //
                      '&.Mui-focused': {
                        color: '#212121',
                      },
                    },
                  }}
                  required
                  inputProps={{
                    maxLength: 80,
                    minLength: 10,
                  }}
                />
              </div>

              {/* ------------------ PRICE ---------------- */}
              {/* ----- REGULAR PRICE ----- */}
              <TextField
                label={`Regular Price ${type === 'rent' ? ' ₹ / Month' : ''}`}
                type="number"
                name="regularPrice"
                value={regularPrice}
                onChange={onChange}
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
                required
                inputProps={{
                  max: 80000000,
                  min: 1000,
                }}
              />
              {/* ----- DISCOUNTED PRICE ----- */}
              {offer && (
                <TextField
                  label={`Discounted Price ${
                    type === 'rent' ? ' ₹ / Month' : ''
                  }`}
                  type="number"
                  name="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
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
                  required
                  inputProps={{
                    max: 80000000,
                    min: 1000,
                  }}
                />
              )}

              {/* -------------------- IMAGES --------------- */}
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
                <label htmlFor="imgSec">Images *</label>
                <p>
                  The first image will be used as the cover image for the post.
                  (max 6 images)
                </p>

                <Button variant="outlined" component="span" className="mt-3">
                  <input
                    type="file"
                    name="images"
                    id="imgSec"
                    onChange={onChange}
                    accept=".jpg, .png, .jpeg"
                    multiple
                    required
                  />
                </Button>
              </FormControl>
            </div>

            {loading ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" className="mt-6" fullWidth>
                Create Post
              </Button>
            )}
          </form>
        </Card>
      </main>
    </div>
  );
}
