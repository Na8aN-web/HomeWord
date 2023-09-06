// ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function ProtectedRoute({ children }) {
  const isAuth = useSelector((state) => state.login.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push('/authentication/AuthLayout')
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [isAuth, router]);

  if (isLoading) {
  
    return <p className='font-mont w-full flex justify-center text-[20px] p-8'>Loading...</p>;
  }

  return children;
}

export default ProtectedRoute;
