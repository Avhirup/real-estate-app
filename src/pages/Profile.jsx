import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import SignUp from './SignUp';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone';
import '../pages css/Profile.css';
import { toast } from 'react-toastify';

export default function Profile() {
  const auth = getAuth();
  // ------------- TO EDIT PERSONAL DETAILS ----------------
  const [changeDetails, setChangeDetails] = useState(false);

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in Firebase
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
    } catch (err) {
      console.log(err);
      toast.error('Could not update profile details');
    }
  };
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

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const navigate = useNavigate();
  const onLogout = () => {
    auth.signOut();
    navigate('/sign-in');
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Your Profile</p>
        {/* <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button> */}
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
              <Button
                style={{ backgroundColor: 'green', borderColor: 'green' }}
                variant="contained"
                size="small"
                startIcon={<DoneOutlineTwoToneIcon />}
              >
                Save
              </Button>
            ) : (
              <Button
                style={{ color: 'black', borderColor: 'black' }}
                variant="outlined"
                size="small"
                endIcon={<CreateTwoToneIcon />}
              >
                Edit
              </Button>
            )}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={emailAlert}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
