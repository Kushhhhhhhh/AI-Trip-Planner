import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { db } from '../../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import { Loader2 } from 'lucide-react';

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const tripDoc = doc(db, 'AI_Trip', tripId);
      const tripSnapshot = await getDoc(tripDoc);

      if (tripSnapshot.exists()) {
        setTrip(tripSnapshot.data());
      } else {
        toast.error("No Trip Found");
      }
    } catch (error) {
      console.error("Error retrieving trip data:", error);
      toast.error("An error occurred while retrieving the trip data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-600" size={48} />
      </div>
    );
  }

  if (!trip) {
    return <div>No Trip Found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-6 md:px-12 lg:px-24">
        <InfoSection trip={trip} />
        <Hotels trip={trip} />
        <PlacesToVisit trip={trip} />
      </div>
    </div>
  );
};

export default ViewTrip;