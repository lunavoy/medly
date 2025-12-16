import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }
    const t = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  // Show spinner while AuthProvider is determining session, but not indefinitely
  if (loading && !timedOut) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // After timeout or once loading resolves, decide based on user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
