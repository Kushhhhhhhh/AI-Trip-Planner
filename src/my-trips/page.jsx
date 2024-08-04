import { getDocs, query, collection, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase-config";
import TripCard from "./TripCard";

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        navigate("/"); 
        return;
      }

      const q = query(collection(db, "AI_Trip"), where("userEmail", "==", user.email));
      const querySnapshot = await getDocs(q);

      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push(doc.data());
      });
      setUserTrips(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Failed to load trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">My Trips</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-5 mt-4">
        {userTrips.length === 0 ? (
          <p className="text-center text-gray-700">No trips found</p>
        ) : (
          userTrips.map((trip, index) => (
            <TripCard key={index} trip={trip} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyTrips;