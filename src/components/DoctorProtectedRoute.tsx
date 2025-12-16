import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function DoctorProtectedRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session) {
        setAllowed(false)
        setLoading(false)
        return
      }
      // Check if user is a doctor by existence in doctors table
      const { data } = await supabase
        .from('doctors')
        .select('id')
        .eq('id', session.session.user.id)
        .maybeSingle()
      setAllowed(!!data)
      setLoading(false)
    })()
  }, [])

  if (loading) return <div />
  if (!allowed) return <Navigate to="/doctor/login" replace />
  return <>{children}</>
}
