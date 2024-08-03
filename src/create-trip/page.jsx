import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useState } from "react";
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
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase-config";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    console.log(`Form data updated: ${name} = ${value}`);
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login successful:", tokenResponse);
      toast.success("Login successful");
      GetUserProfile(tokenResponse);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const GenerateTrip = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login to generate a trip");
      setOpenDialog(true);
      return;
    }

    console.log("Form data on generate:", formData);

    if (!formData.location || !formData.stay || !formData.budget || !formData.travel) {
      toast.error("Please fill all the required fields");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Please wait while we generate your trip");

    const finalPrompt = AI_PROMPT
      .replace('{location}', formData.location.label)
      .replace('{stay}', formData.stay)
      .replace('{travel}', formData.travel)
      .replace('{budget}', formData.budget);

    try {
      const result = await chatSession.sendMessage(finalPrompt);
      console.log("AI Response:", result?.response?.text());

      await SaveTrip(result?.response?.text());

      toast.dismiss(toastId);
      toast.success("Trip generated successfully!");
      
    } catch (error) {
      console.error("Error generating trip:", error);
      
      toast.dismiss(toastId);
      toast.error("An error occurred while generating the trip");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'application/json'
        }
      });
      console.log("User profile:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      GenerateTrip();
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const SaveTrip = async (tripData) => {
    setLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));

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
      toast.error("Failed to save trip data. Please try again.");
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
      toast.success("Trip saved successfully!");
      router(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="font-bold text-2xl sm:text-3xl">Tell us your travel preference 🏕️</h2>
      <p className="mt-3 text-gray-600 text-sm sm:text-base">
        Please provide some basic information and our trip planner will generate a customized itinerary based on your preferences
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
            <Button onClick={GenerateTrip} disabled={loading}>
              {loading ? <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" /> : "Generate Trip"}
            </Button>
          </div>
          <Dialog open={openDialog}>
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
                    <DialogTitle className="font-bold">Sign In with Google</DialogTitle>
                    <p>Please sign in to continue</p>
                  </div>
                  <Button
                    onClick={login}
                    className="mt-5 w-full flex gap-4 items-center"
                    disabled={loading}
                  >
                    Sign In with Google <FcGoogle className="ml-2 mt-1 w-4 h-4" />
                  </Button>
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