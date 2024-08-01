import { Button } from "./ui/button";
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(`https:/www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'application/json'
        }
      });
      console.log("User profile:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

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
 

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

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
      <div>
        {user ? (
          <div className="flex items-center space-x-2">
            <a href="/create-trip">
            <Button variant="outline" className="rounded-full">Create Trip</Button>
            </a>
            <a href="/my-trips">
            <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="user-img"
                    className="h-8 w-8 rounded-full"
                  />
                )}
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="cursor-pointer" onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>
            Sign In
          </Button>
        )}
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
                <span className="font-bold text-3xl">AI Trip Planner</span>
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
  );
};

export default Header;