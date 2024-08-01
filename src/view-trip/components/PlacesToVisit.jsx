import PlaceCard from "./PlaceCard";

const PlacesToVisit = ({ trip }) => {
  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mx-4">Places To Visit</h2>
      <div className="space-y-6">
        {trip?.trip?.itinerary.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md gap-2">
            <h2 className="font-semibold text-xl mb-4">Day - {item.day}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
              {item.plan.map((place, idx) => (
                <PlaceCard key={idx} place={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;