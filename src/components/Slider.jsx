import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import BackdropLoading from '../skeleton/BackdropLoading';
import { toast } from 'react-toastify';
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

export default function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
        const querySnap = await getDocs(q);

        const listingsData = [];

        querySnap.forEach((doc) => {
          return listingsData.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        console.log(listingsData);
        setListings(listingsData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error('Something went wrong');
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div>
        <BackdropLoading />
      </div>
    );
  }

  return (
    listings && (
      <>
        {/* <p className="exploreHeading">Recommended</p> */}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          // navigation
          pagination={{ clickable: true }}
          // scrollbar={{ draggable: true }}
          loop={true}
          //   className="cursor-grab w-[800px] h-[300px] rounded-md"
          className="cursor-pointer w-[800px] h-[300px] rounded-md"
        >
          {listings.map(({ id, data }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="swiperSlideDiv"
              >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  ₹ {data.discountedPrice ?? data.regularPrice}{' '}
                  {data.type === 'rent' && '/ month'}
                </p>
              </div>
              {/* <img
                src={url}
                alt="image"
                className="w-full h-full object-cover"
              /> */}
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
