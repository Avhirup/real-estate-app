import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import ProfileLoading from '../skeleton/ProfileLoading';
import { IoMdShare } from 'react-icons/io';
import { FcOk } from 'react-icons/fc';
import { toast } from 'react-toastify';

//? -------------------------- Material Tailwind -----------------------------
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from '@material-tailwind/react';
//------------------ icons -------------------
//------------------ delete -------------------
import TP from '@mui/material/Tooltip';

import { AiTwotoneDelete } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

//------------------ cash --------------------
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { BsCashCoin } from 'react-icons/bs';

//------------------ bedrooms --------------------
import { FaBed } from 'react-icons/fa6';
import { TbBedOff } from 'react-icons/tb';
import { TbBed } from 'react-icons/tb';

//------------------ bathrooms --------------------
import { LiaBathSolid } from 'react-icons/lia';
import { TbBathOff } from 'react-icons/tb';

//------------------ wifi --------------------
import { FiWifiOff } from 'react-icons/fi';
import { LuWifi } from 'react-icons/lu';

//------------------ furnished --------------------
import { PiArmchair } from 'react-icons/pi';
import { TbArmchair2Off } from 'react-icons/tb';
import { TbArmchair2 } from 'react-icons/tb';

//------------------ furnished --------------------
import { LuParkingCircle } from 'react-icons/lu';
import { BsSignNoParking } from 'react-icons/bs';

//------------------ discount --------------------
import { MdOutlineDiscount } from 'react-icons/md';

//------------------ verified --------------------
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb';

//------------------ AC --------------------
import { TbAirConditioning } from 'react-icons/tb';
import { TbAirConditioningDisabled } from 'react-icons/tb';

//------------------ ANIMAL --------------------
import { FaDog } from 'react-icons/fa6';

//------------------ PURPOSE --------------------
import { PiOfficeChair } from 'react-icons/pi';

//------------------ OWNER TYPE --------------------
import { MdPersonSearch } from 'react-icons/md';

//? -------------------------- Material Tailwind -----------------------------

// Todo -------------------------- React leaflet ---------------------------------
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// Todo -------------------------- React leaflet ---------------------------------

// Todo -------------------------- Swiper ---------------------------------
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
// Todo -------------------------- Swiper ---------------------------------

export default function Post() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      //! making document ref which takes db, name of the collection in db, and id of the data we want
      const docRef = doc(db, 'listings', params.listingId);
      //! getting the snapshot from the reference
      const docSnap = await getDoc(docRef);

      //! checking if the document exists or not
      if (docSnap.exists()) {
        setListing(docSnap.data());
        console.log(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return (
      <div className="container">
        <ProfileLoading />
      </div>
    );
  }

  let discountedPrice = '0';
  listing.offer
    ? (discountedPrice = listing.discountedPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    : (discountedPrice = '0');
  const regularPrice = listing.regularPrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="container">
      <main>
        <div className="listingDetails">
          <Card className="w-full max-w-[26rem] rounded-md shadow-lg">
            {/* ---------------------- PICTURE SECTION OF THE POST -------------------- */}
            <CardHeader
              floated={false}
              color="blue-gray"
              className="rounded-md"
            >
              <div className="w-[full] h-[250px]">
                {/* ----------------------------------------- swiperjs code --------------------------------- */}
                <Swiper
                  // install Swiper modules
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={20}
                  slidesPerView={1}
                  // navigation
                  pagination={{ clickable: true }}
                  // scrollbar={{ draggable: true }}
                  loop={true}
                  className="w-[full] h-[100%] cursor-grab"
                >
                  {listing.imageUrls.map((url, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={url}
                        alt="image"
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* ----------------------------------------- swiperjs code --------------------------------- */}
              </div>
            </CardHeader>

            {/* ---------------------- DETAILS SECTION OF THE POST -------------------- */}
            <CardBody>
              {/* ---------- CardBody Section 1 : Name of the Post ----------- */}
              <div className="sec1">
                <div className="mb-3 flex items-center justify-between">
                  <Typography
                    variant="h3"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {listing.name}
                  </Typography>
                  {/* ------------- DELETE BUTTON ------------- */}
                  {/* {onDelete && (
                  <TP title="Delete this post">
                    <Typography
                      color="blue-gray"
                      className="flex justify-center items-center gap-1.5 font-normal cursor-pointer h-8 w-8 border border-blue-gray-700 rounded-full"
                      onClick={() => onDelete(listing.id, listing.name)}
                    >
                      <AiTwotoneDelete />
                    </Typography>
                  </TP>
                )} */}
                  {/* ------------- SHARE BUTTON ------------- */}
                  <div
                    style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                    className="shareIconDiv"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShareLinkCopied(true);
                      setTimeout(() => {
                        setShareLinkCopied(false);
                      }, 2000);
                      toast.success('Post link copied to clipboard');
                    }}
                  >
                    {shareLinkCopied ? <FcOk /> : <IoMdShare />}
                  </div>
                </div>
              </div>

              {/* ---------- CardBody Section 2 : Description of the Post ----------- */}
              <div className="sec2">
                <Typography variant="h6" className="font-bold">
                  <span className="text-gray-800">Description:</span>{' '}
                  {listing.description === '' ? (
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-medium"
                      style={{ display: 'inline', fontSize: '1.1rem' }}
                    >
                      {`No description added by the ${listing.listedBy}`}
                    </Typography>
                  ) : (
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-medium"
                      style={{ display: 'inline', fontSize: '1.1rem' }}
                    >
                      {listing.description}
                    </Typography>
                  )}
                </Typography>
              </div>

              {/* ---------- CardBody Section 2 : Lister of the Post ----------- */}
              <div className="sec2">
                <Typography variant="h6" className="font-bold">
                  <span className="text-gray-800">Listed by:</span>{' '}
                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="font-medium"
                    style={{ display: 'inline', fontSize: '1.1rem' }}
                  >
                    {listing.listedBy}
                  </Typography>
                </Typography>
              </div>

              {/* ---------- CardBody Section 3 : Location of the Post ----------- */}
              <div className="sec3">
                <Typography
                  variant="h6"
                  className="font-bold"
                  // style={{ display: 'inline' }}
                >
                  <span className="text-gray-800">Address:</span>{' '}
                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="font-medium"
                    style={{ display: 'inline', fontSize: '1.1rem' }}
                  >
                    {listing.location}
                  </Typography>
                </Typography>
                <Typography
                  variant="h6"
                  className="font-bold"
                  // style={{ display: 'inline' }}
                >
                  <span className="text-gray-800">Formatted Address:</span>{' '}
                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="font-medium"
                    style={{ display: 'inline', fontSize: '1.1rem' }}
                  >
                    {listing.formattedLocation}
                  </Typography>
                </Typography>
              </div>

              {/* ---------- CardBody Section 4 : Type of the Post ----------- */}
              <div className="sec4">
                <Typography variant="h6" className="font-bold">
                  <span className="text-gray-800">Type:</span>{' '}
                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="font-medium"
                    style={{ display: 'inline', fontSize: '1.1rem' }}
                  >
                    {`${listing.type === 'rent' ? 'Renting' : 'Selling'}`}
                  </Typography>
                </Typography>
              </div>

              {/* ---------- CardBody Section 4 : Renting this property for ----------- */}
              <div className="sec4">
                <Typography variant="h6" className="font-bold">
                  <span className="text-gray-800">
                    {listing.type === 'rent' ? 'Renting to' : 'Selling for'}:
                  </span>{' '}
                  <Typography
                    variant="paragraph"
                    color="gray"
                    className="font-medium"
                    style={{ display: 'inline', fontSize: '1.1rem' }}
                  >
                    {`${listing.purpose}`}
                  </Typography>
                </Typography>
              </div>

              {/* ---------- CardBody Section 5 : Price section of the Post ----------- */}
              <div className="sec5">
                <Typography variant="h6" className="font-bold">
                  <span className="text-gray-800">Price:</span>{' '}
                  {listing.offer ? (
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-medium"
                      style={{ display: 'inline', fontSize: '1.1rem' }}
                    >
                      <span className="line-through">{`₹${regularPrice}`}</span>{' '}
                      <span>{`₹${discountedPrice} ${
                        listing.type === 'rent' ? '/ Month' : ''
                      }`}</span>
                    </Typography>
                  ) : (
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-medium"
                      style={{ display: 'inline', fontSize: '1.1rem' }}
                    >
                      {' '}
                      {`${regularPrice} ${
                        listing.type === 'rent' ? '/ Month' : ''
                      }`}
                    </Typography>
                  )}
                </Typography>
              </div>
              {/* ---------- CardBody Section 6 : Details section of the Post ----------- */}
              <div className="group mt-6 inline-flex flex-wrap items-center gap-3">
                {/* ------------ PRICE ------------ */}
                {/* <Tooltip
                  content={`₹${
                    listing.offer ? discountedPrice : regularPrice
                  } ${listing.type === 'rent' ? '/ Month' : ''}`}
                >
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    
                    <BsCashCoin />
                  </span>
                </Tooltip> */}
                {/* ------------ BEDROOMS ------------ */}
                <Tooltip content={`${listing.bedrooms} bedrooms`}>
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {listing.bedrooms > 0 ? <TbBed /> : <TbBedOff />}
                  </span>
                </Tooltip>
                {/* ------------ BATHROOMS ------------ */}
                <Tooltip content={`${listing.bathrooms} bathrooms`}>
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {listing.bedrooms > 0 ? <LiaBathSolid /> : <TbBathOff />}
                  </span>
                </Tooltip>
                {/* ------------ AC ------------ */}
                <Tooltip content={`${listing.ac ? 'AC' : 'AC not'} available`}>
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {listing.ac ? (
                      <TbAirConditioning />
                    ) : (
                      <TbAirConditioningDisabled />
                    )}
                  </span>
                </Tooltip>

                {/* ------------ WIFI ------------ */}
                <Tooltip
                  content={`${
                    listing.wifi ? 'Free WiFi' : 'Free WiFi not'
                  } available`}
                >
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {listing.wifi ? <LuWifi /> : <FiWifiOff />}
                  </span>
                </Tooltip>
                {/* ------------ FURNISHED ------------ */}
                <Tooltip
                  content={`${
                    listing.furnished ? 'Furnished' : 'Not furnished'
                  }`}
                >
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {listing.furnished ? <TbArmchair2 /> : <TbArmchair2Off />}
                  </span>
                </Tooltip>

                {/* ------------ PET ------------ */}
                {listing.pet && (
                  <Tooltip
                    content={`${
                      listing.pet ? 'Pets allowed' : 'Pets not allowed '
                    }`}
                  >
                    <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                      <FaDog />
                    </span>
                  </Tooltip>
                )}

                {/* ------------ PARKING ------------ */}
                <Tooltip
                  content={`${
                    listing.parking
                      ? 'Parking area available'
                      : 'Parking area not available'
                  }`}
                >
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    {listing.parking ? (
                      <LuParkingCircle />
                    ) : (
                      <BsSignNoParking />
                    )}
                  </span>
                </Tooltip>
                {/* ------------ DISCOUNT ------------ */}
                {/* {listing.offer && (
                  <Tooltip
                    content={
                      <>
                        Discounted Price{' '}
                        <span className="line-through">{`₹${regularPrice}`}</span>{' '}
                        <span>{`₹${discountedPrice}`}</span>
                      </>
                    }
                  >
                    <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                      <MdOutlineDiscount />
                    </span>
                  </Tooltip>
                )} */}
                {/* ------------ VERIFIED ------------ */}
                {listing.verified && (
                  <Tooltip content="Verified Post">
                    <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                      <TbRosetteDiscountCheckFilled />
                    </span>
                  </Tooltip>
                )}
              </div>
              {/* ------------------------ Map Component ------------------- */}
              <div className="leafletContainer mt-6 rounded-md">
                <MapContainer
                  style={{ height: '100%', width: '100%' }}
                  center={[listing.geolocation.lat, listing.geolocation.lon]}
                  zoom={13}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      listing.geolocation.lat,
                      listing.geolocation.lon,
                    ]}
                  >
                    <Popup>{listing.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardBody>

            {/* ---------------- Contact Owner Button ---------------- */}
            {auth.currentUser?.uid !== listing.userRef && (
              <CardFooter className="pt-0">
                <Link
                  to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                >
                  <Button size="lg" fullWidth={true}>
                    Contact
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
