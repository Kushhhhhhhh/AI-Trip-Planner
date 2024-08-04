import { getDocs, query, collection, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase-config";
import TripCard from "./TripCard";
import { Loader2 } from "lucide-react";

const MyTrips = () => {
  const navigate = useNavigate(); 
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Note this flag

    const GetTrips = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          navigate("/");
          return;
        }

        const firebaseTrips = await fetchFirebaseTrips(user.email);

        if (isMounted) { 
          setUserTrips(firebaseTrips);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        if (isMounted) { 
          setLoading(false); 
        }
      }
    };

    GetTrips();

    return () => {
      isMounted = false; 
    };
  }, [navigate]);

  const fetchFirebaseTrips = async (email) => {
    try {
      const q = query(collection(db, "AI_Trip"), where("userEmail", "==", email));
      const querySnapshot = await getDocs(q);

      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ ...doc.data(), id: doc.id }); // Include document ID if needed
      });
      return trips;
    } catch (error) {
      console.error("Error fetching Firebase trips:", error);
      return []; 
    }
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">My Trips</h2>
      {loading ? (
        <div className="text-center">
          <Loader2 />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-5 mt-4">
          {userTrips.length > 0 ? (
            userTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <div className="text-center">No trips found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTrips;