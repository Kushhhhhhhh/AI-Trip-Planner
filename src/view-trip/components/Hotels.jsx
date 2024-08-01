import HotelCard from "./HotelCard";

const Hotels = ({ trip }) => {

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mx-4">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-5">
        {trip?.trip?.hotel_options?.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;