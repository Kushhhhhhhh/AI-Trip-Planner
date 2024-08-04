import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import { Loader2 } from 'lucide-react';

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = () => {
    try {
      const tripData = localStorage.getItem(`trip-${tripId}`);
      if (tripData) {
        setTrip(JSON.parse(tripData));
      } else {
        toast.error("No Trip Found");
      }
    } catch (error) {
      console.error("Error retrieving trip data:", error);
      toast.error("An error occurred while retrieving the trip data");
    }
  };

  if (!trip) {
    return <div>
     <Loader2 />
      </div>; 
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className="px-6 md:px-12 lg:px-24">
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
      </div>
    </div>
  );
};

export default ViewTrip;