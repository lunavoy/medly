import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../AuthProvider'

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      // No authenticated user — ensure we exit loading state
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  return { profile, loading }
}

export function useDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('available', true)
        .order('rating', { ascending: false })

      if (data) setDoctors(data)
      setLoading(false)
    }

    fetchDoctors()
  }, [])

  return { doctors, loading }
}

export function useAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          start_datetime,
          end_datetime,
          status,
          doctor:doctor_id(id, full_name, gender, specialty_id(specialty))
        `)
        .eq('patient_id', user.id)
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })

      if (error) {
        console.error('Error fetching appointments:', error)
      }
      
      if (data) setAppointments(data)
      setLoading(false)
    }

    fetchAppointments()
  }, [user])

  return { appointments, loading }
}

export function useExams() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchExams = async () => {
      const { data } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (data) setExams(data)
      setLoading(false)
    }

    fetchExams()
  }, [user])

  return { exams, loading }
}

export function useActivities() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchActivities = async () => {
      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30) // últimos 30 dias

      if (data) setActivities(data)
      setLoading(false)
    }

    fetchActivities()
  }, [user])

  return { activities, loading }
}