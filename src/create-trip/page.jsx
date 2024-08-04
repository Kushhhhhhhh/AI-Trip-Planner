import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelList } from "@/data/option";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { AI_PROMPT } from "@/data/option";
import { chatSession } from "@/config/ai-model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { setDoc, doc } from "firebase/firestore";
import { db, auth } from "@/config/firebase-config";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

const CreateTrip = () => {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateTrip = async () => {
    if (!user) {
      toast.error("Please log in to generate a trip.");
      setOpenDialog(true);
      return;
    }

    if (!formData.location || !formData.stay || !formData.budget || !formData.travel) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generating your trip...");

    const finalPrompt = AI_PROMPT
      .replace('{location}', formData.location.label)
      .replace('{stay}', formData.stay)
      .replace('{travel}', formData.travel)
      .replace('{budget}', formData.budget);

    try {
      const result = await chatSession.sendMessage(finalPrompt);
      const tripData = result?.response?.text();

      if (tripData) {
        await saveTrip(tripData);
        toast.success("Trip generated and saved successfully!");
      } else {
        throw new Error("No trip data received.");
      }

    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("An error occurred while generating the trip.");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const saveTrip = async (tripData) => {
    const docId = Date.now().toString();

    if (!user?.email) {
      console.error("User email is missing.");
      toast.error("User email is missing. Please log in again.");
      setLoading(false);
      return;
    }

    let parsedTripData;

    try {
      parsedTripData = JSON.parse(tripData);
    } catch (error) {
      console.error("Invalid JSON in tripData:", error);
      toast.error("Please try again with different options.");
      setLoading(false);
      return;
    }

    try {
      await setDoc(doc(db, "AI_Trip", docId), {
        userSelection: formData,
        trip: parsedTripData,
        userEmail: user.email,
        id: docId
      });
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="font-bold text-2xl sm:text-3xl">Tell us your travel preference 🏕️</h2>
      <p className="mt-3 text-gray-600 text-sm sm:text-base">
        Please provide some basic information and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-10 sm:mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-lg sm:text-xl my-3 font-medium">What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (val) => {
                setPlace(val);
                handleInputChange('location', val);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl my-3 font-medium">How many days would you like to stay?</h2>
          <Input
            type="number"
            placeholder="Max. 7"
            onChange={(e) => handleInputChange('stay', e.target.value)}
          />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl my-3 font-medium">What is your Budget?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow-md cursor-pointer ${formData.budget === item.title ? 'shadow-lg border-black' : ''}`}
                onClick={() => handleInputChange('budget', item.title)}
              >
                <h2 className="text-2xl sm:text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-sm sm:text-lg">{item.title}</h2>
                <h2 className="text-gray-500 text-xs sm:text-sm">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg hover:shadow-md cursor-pointer ${formData.travel === item.people ? 'shadow-lg border-black' : ''}`}
                onClick={() => handleInputChange('travel', item.people)}
              >
                <h2 className="text-2xl sm:text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-sm sm:text-lg">{item.title}</h2>
                <h2 className="text-gray-600 text-xs sm:text-sm">{item.desc}</h2>
              </div>
            ))}
          </div>
          <div className="my-10 justify-end flex">
            <Button onClick={generateTrip} disabled={loading}>
              {loading ? <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" /> : "Generate Trip"}
            </Button>
          </div>
          <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                  <div className="flex items-center space-x-4">
                    <img
                      src="/ai-trip-planner.png"
                      alt="logo"
                      className="h-10 w-10 rounded-xl shadow-lg"
                    />
                    <span className="font-bold text-xl sm:text-3xl">AI Trip Planner</span>
                  </div>
                  <div className="my-6 text-center">
                    <DialogTitle className="font-bold">Sign In Required</DialogTitle>
                    <p>Please log in to continue.</p>
                    <div className="mt-6 flex justify-center space-x-4">
                      <a href="/sign-in">
                        <Button variant="outline">Sign In</Button>
                      </a>
                      <a href="/sign-up">
                        <Button variant="outline">Sign Up</Button>
                      </a>
                      {user && (
                        <Button variant="outline" onClick={handleLogout}>
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;