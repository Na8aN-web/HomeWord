import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false); // Mark the loading process as complete

      if (user) {
        setAuthenticated(true); // User is authenticated
      } else {
        setAuthenticated(false); // User is not authenticated
        router.push('/authentication/AuthLayout'); // Redirect to the login page
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Render a loading indicator while checking authentication state
    return <div className='flex justify-center font-mont text-[32px] p-8'>Loading...</div>;
  }

  if (authenticated) {
    // Render the protected content if the user is authenticated
    return children;
  }

  // Render nothing if the user is not authenticated (or is still loading)
  return null;
};

export default ProtectedRoute;
