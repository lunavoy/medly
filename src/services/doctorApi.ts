import { supabase } from '../supabase/client'

const callFunction = async (name: string, params?: Record<string, any>) => {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`
  const { data: session } = await supabase.auth.getSession()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (session?.session?.access_token) {
    headers['Authorization'] = `Bearer ${session.session.access_token}`
  }
  const res = await fetch(params ? `${url}?${new URLSearchParams(params as any)}` : url, {
    method: 'GET',
    headers
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw err
  }
  return res.json()
}

export const doctorApi = {
  getAuthorizedPatients: async () => {
    return callFunction('doctor-authorized-patients')
  },
  getPatientProfile: async (patientId: string) => {
    return callFunction('doctor-patient-profile', { patient_id: patientId })
  }
}
