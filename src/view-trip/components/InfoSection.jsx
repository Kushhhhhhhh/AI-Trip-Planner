import { searchPhotos } from '../../config/unsplash-api';
import { useState, useEffect } from 'react';

const InfoSection = ({ trip }) => {
  const [photos, setPhotos] = useState([]);
  const locationLabel = trip?.userSelection?.location.label;

  useEffect(() => {
    const fetchPhotos = async () => {
      if (locationLabel) {
        const results = await searchPhotos(locationLabel);
        setPhotos(results);
      }
    };
    fetchPhotos();
  }, [locationLabel]);

  return (
    <div className="container mx-auto p-2 md:p-4 lg:p-6">
      {photos.length > 0 && (
        <img
          key={photos[0].id} 
          src={photos[0].urls.regular} 
          alt={photos[0].alt_description}
          className="w-full object-cover rounded-xl md:h-[250px] lg:h-[300px]"
        />
      )}
      <div className="flex flex-wrap justify-between items-center my-4">
        <div className="w-full md:w-2/3 lg:w-3/4 my-4 md:mb-0">
          <h2 className="text-3xl font-bold">{locationLabel}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <h2 className="text-xs md:text-sm bg-gray-200 text-gray-800 rounded-full p-2 px-4">
              📅 {trip?.userSelection?.stay} Days
            </h2>
            <h2 className="text-xs md:text-sm bg-gray-200 text-gray-800 rounded-full p-2 px-4">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="text-xs md:text-sm bg-gray-200 text-gray-800 rounded-full p-2 px-4">
              🧑🏻 No. of Traveler: {trip?.userSelection?.travel}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;