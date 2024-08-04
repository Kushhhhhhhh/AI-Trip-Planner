import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelList } from "@/data/option";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { AI_PROMPT } from "@/data/option";
import { chatSession } from "@/config/ai-model";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase-config"; 
import { collection, addDoc } from "firebase/firestore";

const CreateTrip = () => {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    console.log(`Form data updated: ${name} = ${value}`);
  };

  const GenerateTrip = async () => {
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

  const SaveTrip = async (tripData) => {
    setLoading(true);
    const docId = Date.now().toString();

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
      // Save trip data to Firestore
      await addDoc(collection(db, "AI_Trip"), {
        userSelection: formData,
        trip: parsedTripData,
        id: docId,
        createdAt: new Date()
      });
      toast.success("Trip saved successfully!");
      navigate(`/view-trip/${docId}`);
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
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;