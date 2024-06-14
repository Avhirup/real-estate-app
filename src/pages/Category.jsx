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

export default function Category() {
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
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // by executing the query we'll get the SnapShot of the DB
        const querySnap = await getDocs(qry);

        // We need to loop through the snapshot we get back in order to get the data
        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // Storing the data into state and make loading false
        setListings(listings);
        setLoading(false);
        // console.log(listings);
      } catch (err) {
        console.log(err);
        toast.error('Could not get the data');
      }
    };

    fetchListings();
  }, [params.categoryName]);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === 'rent'
            ? 'Properties for rent'
            : 'Properties for sale'}
        </p>
      </header>

      {loading ? (
        <ProfileLoading />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="catrgoryListings">
              {listings.map((listing) => {
                // return <h3 key={listing.id}>{listing.data.name}</h3>;
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}
