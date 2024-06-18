import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import ProfileLoading from '../skeleton/ProfileLoading';
import { toast } from 'react-toastify';

// ! -------------------------- Material Tailwind ------------------------------
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from '@material-tailwind/react';

export default function Contact() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlordDetails = async () => {
      // ! ---------- Making Document Reference -----------
      const docRef = doc(db, 'users', params.landlordId);

      // ! ---------- Trying to get the data / snapshot of the Collection using the docRef we made -----------
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get the owener data');
      }
    };

    getLandlordDetails();
  }, [params.landlordId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  if (loading) {
    <div className="container">
      <ProfileLoading />
    </div>;
  }

  return (
    <div className="container">
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Contact details of the owner</p>
        </header>

        {landlord !== null && (
          <main>
            <Card
              color="transparent"
              shadow={false}
              className="w-full max-w-[26rem]"
            >
              <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-4 pt-0 pb-8"
              >
                <div className="w-[50px] h-[50px] flex items-center justify-center text-center rounded-full bg-[#FF7F3E] text-white">
                  <h1 className="text-lg font-bold">
                    {landlord.name.charAt(0).toUpperCase()}
                  </h1>
                </div>
                <div className="flex w-full flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray">
                      {landlord.name}
                    </Typography>
                  </div>
                  <Typography color="blue-gray">{landlord.email}</Typography>
                </div>
              </CardHeader>
              <CardBody className="mb-6 p-0">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Typography variant="h5">Description: </Typography>
                    <Typography>&quot;{landlord.description}&quot;</Typography>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Typography variant="h5">Contact No: </Typography>
                    {/* <Typography>&quot;{landlord.phoneNumber}&quot;</Typography> */}
                    <a
                      href={`tel:${landlord.phoneNumber}`}
                      className="text-[#050C9C] underline"
                    >
                      {landlord.phoneNumber}
                    </a>
                  </div>
                </div>
                {/* -------------------- Email section ------------------- */}
                <form className="messageForm">
                  <div className="messageDiv">
                    <label htmlFor="message" className="messageLabel">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      className="textarea"
                      value={message}
                      onChange={onChange}
                    ></textarea>
                  </div>
                  <a
                    href={`mailto:${landlord.email}?Subject=${searchParams.get(
                      'listingName'
                    )}&body=${message}`}
                  >
                    <Button type="button" className="mt-2" fullWidth>
                      Send Message
                    </Button>
                  </a>
                </form>
              </CardBody>
            </Card>
          </main>
        )}
      </div>
    </div>
  );
}
