import { useParams } from 'react-router-dom';
import { db } from '@/config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AI_Trip", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTrip(docSnap.data());
    } else {
      toast.error("No Trip Found");
    }
  };

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