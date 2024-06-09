import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleOAuth() {
  const nagivate = useNavigate();
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
      if (!docSnap.exists) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      // after successfully register, navigate to home page
      nagivate('/');
    } catch (err) {
      console.log(err);
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
