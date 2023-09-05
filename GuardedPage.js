// GuardedPage.js

import { useEffect } from 'react';
import { useAuth } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

const GuardedPage = ({ children, whenSignedOut }) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      const shouldLogOut = !user && whenSignedOut;
      
      if (shouldLogOut) {
        // Redirect the user to the specified route
        router.push(whenSignedOut);
      }
    });

    return () => listener();
  }, [auth, router, whenSignedOut]);

  return <>{children}</>;
};

export default GuardedPage;
