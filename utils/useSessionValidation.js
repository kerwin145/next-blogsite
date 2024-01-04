// useSessionValidation.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const useSessionValidation = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'loading') {
      return;
    }

    if (!session || !session.user || !session.user.id) {
      alert('You need to be logged in to view this page');
      router.push('/');
    }
  }, [sessionStatus, session, router]);

  return { session, sessionStatus };
};

export default useSessionValidation;
