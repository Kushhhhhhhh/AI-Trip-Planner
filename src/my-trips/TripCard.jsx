/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchPhotos } from '../config/unsplash-api';

function TripCard({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/view-trip.jpg'); 

  useEffect(() => {
    const fetchPhoto = async () => {
      if (trip?.userSelection?.location?.label) {
        const results = await searchPhotos(trip.userSelection.location.label);
        if (results.length > 0) {
          setPhotoUrl(results[0].urls.regular); 
        }
      }
    };
    fetchPhoto();
  }, [trip?.userSelection?.location?.label]);

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-all cursor-pointer">
        <img src={photoUrl} alt="my-trip" className="w-full object-cover rounded-xl h-[200px] sm:h-[250px]" />
        <div className="mt-4">
          <h2 className="text-base sm:text-lg font-semibold">
            {trip?.userSelection?.location?.label}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mt-1">
            {trip?.userSelection?.stay} Days with {trip?.userSelection?.budget} Budget 💰
          </p>
        </div>
      </div>
    </Link>
  );
}

export default TripCard;