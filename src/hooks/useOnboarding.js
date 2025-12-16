import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export function useOnboarding() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    cpf: '',
    email: '',
    bloodType: '',
    allergies: '',
    organDonor: false,
    bloodDonor: false,
    chronicConditions: ''
  })

  // Load existing user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser()
        const userId = auth?.user?.id
        
        if (!userId) {
          setLoading(false)
          return
        }

        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, birth_date, gender, cpf, email')
          .eq('id', userId)
          .single()

        // Fetch health profile data
        const { data: healthProfile } = await supabase
          .from('patient_health_profile')
          .select('blood_type_id, allergies, organ_donor, blood_donor')
          .eq('profile_id', userId)
          .single()

        const hasCompleteProfile = profile?.full_name && profile?.cpf && profile?.birth_date
        
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.full_name || '',
            birthDate: profile.birth_date || '',
            gender: profile.gender || '',
            cpf: profile.cpf || '',
            email: profile.email || ''
          }))
        }

        if (healthProfile) {
          setFormData((prev) => ({
            ...prev,
            allergies: healthProfile.allergies || '',
            organDonor: healthProfile.organ_donor || false,
            bloodDonor: healthProfile.blood_donor || false
          }))
        }

        setIsComplete(!!hasCompleteProfile)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const saveData = async () => {
    setSaving(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id

      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Update or insert profile
      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: formData.fullName,
          birth_date: formData.birthDate,
          gender: formData.gender,
          cpf: formData.cpf,
          email: formData.email,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      // Get or create health profile
      const { data: existingHP } = await supabase
        .from('patient_health_profile')
        .select('id')
        .eq('profile_id', userId)
        .single()

      if (existingHP) {
        // Update existing health profile
        await supabase
          .from('patient_health_profile')
          .update({
            allergies: formData.allergies,
            organ_donor: formData.organDonor,
            blood_donor: formData.bloodDonor,
            last_modified_at: new Date().toISOString()
          })
          .eq('id', existingHP.id)
      } else {
        // Create new health profile
        await supabase
          .from('patient_health_profile')
          .insert({
            profile_id: userId,
            allergies: formData.allergies,
            organ_donor: formData.organDonor,
            blood_donor: formData.bloodDonor
          })
      }

      setSaving(false)
      return true
    } catch (err) {
      console.error('Erro ao salvar dados:', err)
      setSaving(false)
      return false
    }
  }

  return {
    loading,
    saving,
    isComplete,
    formData,
    setFormData,
    saveData
  }
}
