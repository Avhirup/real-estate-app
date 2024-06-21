import { Link } from 'react-router-dom';
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
import { toast } from 'react-toastify';
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

//------------------ ANIMAL --------------------
import { FaDog } from 'react-icons/fa6';

//------------------ EDIT --------------------
import { AiTwotoneEdit } from 'react-icons/ai';

export default function ListingItems({
  listing,
  id,
  onDelete,
  onEdit,
  renderedInProfilePage = false,
}) {
  let discountedPrice = '0';
  listing.offer
    ? (discountedPrice = listing.discountedPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    : (discountedPrice = '0');
  const regularPrice = listing.regularPrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  console.log(listing);
  return (
    <li className="categoryListing">
      <Card className="w-full max-w-[26rem] rounded-md shadow-lg">
        <CardHeader floated={false} color="blue-gray" className="rounded-md">
          <div className="w-[300px] h-[200px]">
            <img
              src={listing.imageUrls[0]}
              alt="image"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="font-medium">
              {listing.name}
            </Typography>
            <div className="btn-div flex justify-center align-middle gap-2">
              {/* ------------- EDIT BUTTON ------------- */}
              {onEdit && (
                <TP title="Edit this post">
                  <Typography
                    color="blue-gray"
                    className="flex justify-center items-center gap-1.5 font-normal cursor-pointer h-8 w-8 border border-blue-gray-700 rounded-full"
                    onClick={() => onEdit()}
                  >
                    <AiTwotoneEdit />
                  </Typography>
                </TP>
              )}
              {/* ------------- DELETE BUTTON ------------- */}
              {onDelete && (
                <TP title="Delete this post">
                  <Typography
                    color="blue-gray"
                    className="flex justify-center items-center gap-1.5 font-normal cursor-pointer h-8 w-8 border border-blue-gray-700 rounded-full"
                    onClick={() => onDelete(listing.id, listing.name)}
                  >
                    <AiTwotoneDelete />
                  </Typography>
                </TP>
              )}
            </div>
          </div>
          <Typography color="gray">
            <span className="text-gray-900 font-medium">Address:</span>{' '}
            {listing.location}
          </Typography>
          {!renderedInProfilePage && (
            <div className="group mt-6 inline-flex flex-wrap items-center gap-3">
              {/* ------------ PRICE ------------ */}
              <Tooltip
                content={`₹${
                  // eslint-disable-next-line react/prop-types
                  listing.offer ? discountedPrice : regularPrice
                } ${listing.type === 'rent' ? '/ Month' : ''}`}
              >
                <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                  {/* <LiaMoneyBillWaveSolid /> */}
                  <BsCashCoin />
                </span>
              </Tooltip>
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
              {/* ------------ WIFI ------------ */}
              <Tooltip content={`${listing.wifi ? 'Free' : 'No free'} wifi`}>
                <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                  {listing.wifi ? <LuWifi /> : <FiWifiOff />}
                </span>
              </Tooltip>
              {/* ------------ FURNISHED ------------ */}
              <Tooltip
                content={`${listing.furnished ? 'Furnished' : 'Not furnished'}`}
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
                  {listing.parking ? <LuParkingCircle /> : <BsSignNoParking />}
                </span>
              </Tooltip>
              {/* ------------ DISCOUNT ------------ */}
              {listing.offer && (
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
              )}
              {/* ------------ VERIFIED ------------ */}
              {listing.verified && (
                <Tooltip content="Verified Post">
                  <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                    <TbRosetteDiscountCheckFilled />
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </CardBody>
        <CardFooter className="pt-3">
          <Link to={`/category/${listing.type}/${id}`}>
            <Button size="lg" fullWidth={true}>
              {renderedInProfilePage ? 'Details' : 'Reserve'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </li>
  );
}
