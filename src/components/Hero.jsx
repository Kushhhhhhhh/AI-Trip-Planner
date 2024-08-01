import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <main className="flex flex-col items-center px-5 sm:px-10 md:px-32 lg:px-56 gap-10">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mt-10 sm:mt-16">
        <span className="text-blue-400">Embark on Your Next Adventure with AI:</span> Personalized Journeys Just a Tap Away!
      </h2>
      <p className="text-lg sm:text-xl text-gray-600 text-center">
        Your AI-powered journey planner will help you find the perfectly crafted itinerary that meets your interests and budget.
      </p>
      <Link to="/create-trip">
        <Button className="py-3 px-6 sm:py-4 sm:px-8 text-base sm:text-lg">Get Started</Button>
      </Link>
      <div className="max-w-xl mx-auto my-6">
        <img src="/landing-page.png" alt="landing-page" className="w-full object-cover rounded-xl"/>
      </div>
    </main>
  );
};

export default Hero;