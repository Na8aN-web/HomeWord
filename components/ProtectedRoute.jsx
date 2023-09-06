import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from "../firebase";
import 'firebase/auth';

function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/authentication/AuthLayout').finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  if (isLoading) {
    return <p className='font-mont w-full flex justify-center text-[20px] p-8'>Loading...</p>;
  }

  return children;
}

export default ProtectedRoute;
