import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data?.session) setAuthenticated(true);
      setChecking(false);
    });
    return () => { mounted = false; };
  }, []);

  if (checking)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}
