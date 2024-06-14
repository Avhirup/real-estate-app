import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import ProfileLoading from '../skeleton/ProfileLoading';
import ListingItems from '../components/categories/ListingItems';

export default function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // creating reference to the collection
        const listingsRef = collection(db, 'listings');

        // creating a query to get the data according to our need
        const qry = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // by executing the query we'll get the SnapShot of the DB
        const querySnap = await getDocs(qry);

        // We need to loop through the snapshot we get back in order to get the data
        const listingsArray = [];

        querySnap.forEach((doc) => {
          return listingsArray.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // Storing the data into state and make loading false
        setListings(listingsArray);
        setLoading(false);
        // console.log(listings);
      } catch (err) {
        console.log(err);
        toast.error('Could not get the data');
      }
    };

    fetchListings();
  }, []);
  return (
    <div className="category container">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <ProfileLoading />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="catrgoryListings">
              {listings.map((listing) => {
                return (
                  <ListingItems
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                );
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>No offers are available at this moment!</p>
      )}
    </div>
  );
}
