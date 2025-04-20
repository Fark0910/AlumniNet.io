
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase_set/firebase';

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login'); 
      }
    });

    return () => unsub(); 
  }, []);
};

export default useAuthGuard;
