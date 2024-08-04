import { Button } from "./ui/button";
import { useEffect, useState } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }

  }, [user, setUser]);

  return (
    <div className="p-4 shadow-sm flex justify-between items-center px-5 mb-4">
      <div className="flex items-center space-x-3">
        <a href="/" className="flex gap-3">
          <img
            src="/ai-trip-planner.png"
            alt="logo"
            className="h-10 w-10 rounded-xl"
          />
          <span className="font-bold text-2xl hidden md:block">AI Trip Planner</span>
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <a href="/create-trip">
            <Button variant="outline" className="rounded-full">Create Trip</Button>
          </a>
          <a href="/my-trips">
            <Button variant="outline" className="rounded-full">My Trips</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;