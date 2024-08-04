import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase-config';
import SignUp from './components/SignUp';
import Hero from './components/Hero';
import { Loader2 } from 'lucide-react';

const App = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>
      <Loader2 />
    </div>;
  }

  return (
    <main>
      <div>
        {user ? (
           <Hero />
        ) : (
          <>
            <SignUp />
          </>
        )}
      </div>
    </main>
  );
};

export default App;