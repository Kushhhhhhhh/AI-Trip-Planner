import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchPhotos } from '../../config/unsplash-api';

const PlaceCard = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState('/view-trip.jpg'); // Default image

  useEffect(() => {
    const fetchPhoto = async () => {
      if (place?.place) {
        const results = await searchPhotos(place.place);
        if (results.length > 0) {
          setPhotoUrl(results[0].urls.regular); // Use a higher resolution image
        }
      }
    };
    fetchPhoto();
  }, [place?.place]);

  return (
    <Link to={`https://www.google.com/maps/search/?api=1&query=${place.place}`} target="_blank">
      <div className="flex flex-col sm:flex-row shadow-sm border rounded-xl p-3 mt-2 gap-5 hover:scale-105 transition-all hover:shadow-lg">
        <img src={photoUrl} alt={place.place} className="w-full md:w-[200px] h-[150px] rounded-xl object-cover" />
        <div>
          <h2 className="font-bold text-lg">{place.place}</h2>
          <h2 className="text-sm font-medium text-gray-600 mb-2">{place.details}</h2>
          <h2 className="text-sm font-medium text-orange-600">🕒 {place.time}</h2>
          <h2 className="text-sm font-medium text-yellow-400">⭐ {place.rating} Stars</h2>
          {place.ticket_pricing && (
            <h2 className="text-sm font-medium text-green-500">💸 {place.ticket_pricing}</h2>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
