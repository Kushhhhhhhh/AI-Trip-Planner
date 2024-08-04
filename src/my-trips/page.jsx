import { getDocs, query, collection, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase-config";
import TripCard from "./TripCard";

const MyTrips = () => {
  const navigate = useNavigate(); 
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetTrips();
  }, []); 

  const GetTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/"); 
      return;
    }

    // Fetch trips from Firebase
    const firebaseTrips = await fetchFirebaseTrips(user.email);

    // Fetch trips from Local Storage
    const localStorageTrips = fetchLocalStorageTrips();

    // Combine both trips
    const combinedTrips = [...firebaseTrips, ...localStorageTrips];

    setUserTrips(combinedTrips);
  };

  const fetchFirebaseTrips = async (email) => {
    const q = query(collection(db, "AI_Trip"), where("userEmail", "==", email));
    const querySnapshot = await getDocs(q);

    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    return trips;
  };

  const fetchLocalStorageTrips = () => {
    const trips = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("trip-")) {
        const tripData = localStorage.getItem(key);
        if (tripData) {
          trips.push(JSON.parse(tripData));
        }
      }
    }
    return trips;
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">My Trips</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-5 mt-4">
        {userTrips.map((trip, index) => (
          <TripCard key={index} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default MyTrips;