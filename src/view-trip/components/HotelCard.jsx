import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchPhotos } from '../../config/unsplash-api';

const HotelCard = ({ hotel, index }) => {
  const [photoUrl, setPhotoUrl] = useState('/view-trip.jpg'); 

  useEffect(() => {
    const fetchPhoto = async () => {
      if (hotel?.hotel_name) {
        const results = await searchPhotos(hotel.hotel_name);
        if (results.length > 0) {
          setPhotoUrl(results[0].urls.regular); 
        }
      }
    };
    fetchPhoto();
  }, [hotel?.hotel_name]);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotel_name},${hotel?.hotel_address}`}
      target="_blank"
      key={index}
      className="hover:scale-105 transition-all cursor-pointer"
    >
      <div className="bg-white p-4 rounded-xl shadow-md">
        <img src={photoUrl} alt={hotel?.hotel_name} className="rounded-xl w-full h-48 object-cover" />
        <div className="my-3 flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{hotel?.hotel_name}</h2>
          <h2 className="text-xs text-gray-600">{hotel?.hotel_address} 📍</h2>
          <h2 className="text-sm">{hotel?.price} 💸</h2>
          <h2 className="text-sm">{hotel?.rating} Stars ⭐</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;