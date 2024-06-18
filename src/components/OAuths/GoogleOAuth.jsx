import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleOAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // cheking that user already exists or not
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      // If user do not exists then adding his/her data into firestore db (into 'users' collection)
      if (!docSnap.exists()) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            description: '',
            phoneNumber: '',
            timestamp: serverTimestamp(),
          });
          toast.success('Authentication successful');
        } catch (err) {
          console.error('Error adding user to Firestore:', err);
          toast.error('Error saving user data');
          return;
        }
      }

      // after successfully register, navigate to home page
      navigate('/');
    } catch (err) {
      console.log('Google sign-in error:', err);
      toast.error('Could not authorize with Google');
      setTimeout(() => {
        toast('Please try with email and password');
      }, 1500);
    }
  };

  return (
    <div>
      <FcGoogle
        size={'2.2rem'}
        style={{ cursor: 'pointer' }}
        onClick={onGoogleClick}
      />
    </div>
  );
}
