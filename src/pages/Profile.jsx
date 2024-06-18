import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import SignUp from './SignUp';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone';
import '../pages css/Profile.css';
import { Button as BTN } from '@material-tailwind/react';
import { IoAddCircleOutline } from 'react-icons/io5';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import ProfileLoading from '../skeleton/ProfileLoading';
import ListingItems from '../components/categories/ListingItems';
import BackdropLoading from '../skeleton/BackdropLoading';

export default function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [orgDetails, setOriginalDetails] = useState({
    orgPhoneNumber: '',
    orgDescription: '',
  });
  const { orgPhoneNumber, orgDescription } = orgDetails;

  // ! ---------------------------------------------------------------------------------------
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    phoneNumber: '',
    description: '',
  });
  const { name, email, description, phoneNumber } = formData;

  // ----------------- Storing input value into local state --------------------
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const emailAlert = () => {
    if (changeDetails) toast.warning('Email cannot be changed');
  };
  // ------------- ------------------------ ----------------

  //! ---------------------- Logout function  -------------------------
  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
    navigate('/sign-in');
  };

  //! ------------- TO EDIT PERSONAL DETAILS ---------------
  const onSubmit = async () => {
    console.log(formData);
    try {
      // If name is updated
      if (auth.currentUser.displayName !== name) {
        // Update display name in indexDB
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
        toast.success('Profile details successfully changed');
      }

      // If phone number is updated
      if (orgPhoneNumber !== phoneNumber) {
        // Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          phoneNumber,
        });

        // Update in localState
        setOriginalDetails((prevState) => ({
          ...prevState,
          orgPhoneNumber: phoneNumber,
        }));
        toast.success('Phone number updated successfully');
      }

      // If description is updated
      if (orgDescription !== description) {
        // Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          description,
        });
        toast.success('Description updated successfully');
        // Update in localState
        setOriginalDetails((prevState) => ({
          ...prevState,
          orgDescription: description,
        }));
      }
    } catch (err) {
      console.log(err);
      toast.error('Could not update profile details');
    }
  };
  //! ------------- TO EDIT PERSONAL DETAILS ----------------

  //! ------------- Fetch User Data to show in profile section ----------------
  useEffect(() => {
    //? ------------------ FOR FETCHING USERS DATA -------------------
    const fetchUserDetails = async () => {
      setLoading(true);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        //* Setting formData
        setFormData((prevState) => ({
          ...prevState,
          phoneNumber: userData.phoneNumber || '',
          description: userData.description || '',
        }));
        //* Making an extra copy to track update of phone number and description
        setOriginalDetails({
          orgPhoneNumber: userData.phoneNumber || '',
          orgDescription: userData.description || '',
        });
      }
      setLoading(false);
    };
    //? ------------------ FOR FETCHING USERS DATA -------------------

    //? ------------------ FOR FETCHING USERS LISTINGS -------------------
    const fetchUserListings = async () => {
      setLoading(true);
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);
      const userListings = [];

      querySnap.forEach((doc) => {
        return userListings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(userListings);
      setLoading(false);
    };
    //? ------------------ FOR FETCHING USERS LISTINGS -------------------

    fetchUserDetails();
    fetchUserListings();
  }, [auth.currentUser.uid]);
  //! ------------- Fetch User Data to show in profile section ----------------

  //! ------------- onDelete function to delete a listing ----------------
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this post ?')) {
      setPageLoading(true);
      try {
        // todo --------------------- delete listing from firebase ---------------------
        await deleteDoc(doc(db, 'listings', listingId));

        // todo --------- set listings data to the updated value in the local state to update the UI -----------
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingId
        );
        setListings(updatedListings);
        toast.success('Post Deleted successfully');
      } catch (err) {
        console.log(err);
        toast.error('Something went wrong!');
      } finally {
        setPageLoading(false);
      }
    }
  };
  //! ------------- onDelete function to delete a listing ----------------

  if (loading) {
    return (
      <div className="container">
        <ProfileLoading />
      </div>
    );
  }

  if (pageLoading) {
    return <BackdropLoading />;
  }

  return (
    <div className="profile container">
      <header className="profileHeader">
        <p className="pageHeader">Your Profile</p>
        <Button
          type="button"
          variant="outlined"
          color="error"
          size="small"
          onClick={onLogout}
          endIcon={<LogoutIcon />}
        >
          Log out
        </Button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? (
              <Tooltip title="Save your details">
                <Button
                  style={{ backgroundColor: 'green', borderColor: 'green' }}
                  variant="contained"
                  size="small"
                  startIcon={<DoneOutlineTwoToneIcon />}
                >
                  Save
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Edit your details">
                <Button
                  style={{ color: 'black', borderColor: 'black' }}
                  variant="outlined"
                  size="small"
                  endIcon={<CreateTwoToneIcon />}
                >
                  Edit
                </Button>
              </Tooltip>
            )}
          </p>
        </div>
        <div className="profileCard mb-10">
          <form className="flex gap-3 flex-col align-middle justify-center">
            {/* ---------- name field ----------- */}
            <div className="nam-sec flex gap-2">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
            </div>
            {/* ---------- email field ----------- */}
            <div className="email-sec flex gap-2">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                className={
                  !changeDetails ? 'profileEmail' : 'profileEmailActive'
                }
                disabled={!changeDetails}
                value={email}
                onChange={emailAlert}
              />
            </div>
            {/* ---------- description field ----------- */}
            {/* <div className="description-sec flex gap-2">
              <label htmlFor="description">Description: </label>
              <input
                type="text"
                id="description"
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={description}
                onChange={onChange}
              />
            </div> */}
            <div className="description-sec flex gap-2">
              <label htmlFor="description">Description: </label>
              <textarea
                id="description"
                // className={!changeDetails ? 'profileName' : 'profileNameActive'}
                className="textarea"
                disabled={!changeDetails}
                value={description}
                onChange={onChange}
                rows={4} // Adjust the number of rows as needed
                style={{ resize: 'vertical' }} // Allow vertical resizing if desired
              />
            </div>
            {/* ---------- phone number field ----------- */}
            <div className="phone-no-sec flex gap-2">
              <label htmlFor="phoneNumber">Number: </label>
              <input
                type="number"
                id="phoneNumber"
                className={!changeDetails ? 'profileName' : 'profileNameActive'}
                disabled={!changeDetails}
                value={phoneNumber === '' ? '' : phoneNumber}
                onChange={onChange}
              />
            </div>
          </form>
        </div>
        <Link to={'/create-listing'}>
          <Tooltip title="List your property for sale or rental">
            <BTN className="flex items-center gap-3">
              <IoAddCircleOutline size={20} /> Sell / Rent your property
            </BTN>
          </Tooltip>
        </Link>

        {/* ----------------- users all listings ----------------- */}
        {!loading && listings?.length > 0 && (
          <>
            <header className="profileHeader mb-4">
              <p className="listingText pageHeader">Your Listings</p>
            </header>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItems
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  renderedInProfilePage={true}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
