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
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, birth_date, gender, cpf, email')
          .eq('id', userId)
          .maybeSingle()

        if (profileError) {
          console.error('[ONBOARDING] Profile fetch error:', profileError)
        }

        // Fetch health profile data
        const { data: healthProfile, error: healthError } = await supabase
          .from('patient_health_profile')
          .select('blood_type_id, allergies, organ_donor, blood_donor')
          .eq('profile_id', userId)
          .maybeSingle()

        if (healthError) {
          console.error('[ONBOARDING] Health profile fetch error:', healthError)
        }

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
            allergies: healthProfile.alergies || '',
            organDonor: healthProfile.organ_donor || false,
            bloodDonor: healthProfile.blood_donor || false
          }))
        }

        setIsComplete(!!hasCompleteProfile)
        setLoading(false)
      } catch (err) {
        console.error('[ONBOARDING] Error loading data:', err)
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

      // Update or insert profile (without updated_at column since it doesn't exist)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: formData.fullName,
          birth_date: formData.birthDate,
          gender: formData.gender,
          cpf: formData.cpf,
          email: formData.email
        }, { onConflict: 'id' })
      
      if (profileError) {
        console.error('[ONBOARDING] Profile save failed:', profileError)
        throw profileError
      }

      // Get or create health profile
      const { data: existingHP, error: hpCheckError } = await supabase
        .from('patient_health_profile')
        .select('id')
        .eq('profile_id', userId)
        .maybeSingle()
      
      if (hpCheckError) {
        console.error('[ONBOARDING] Health profile check error:', hpCheckError)
      }

      if (existingHP?.id) {
        // Update existing health profile
        const { error: updateError } = await supabase
          .from('patient_health_profile')
          .update({
            alergies: formData.allergies,
            organ_donor: formData.organDonor,
            blood_donor: formData.bloodDonor
          })
          .eq('id', existingHP.id)

        if (updateError) {
          console.error('[ONBOARDING] Health profile update failed:', updateError)
          throw updateError
        }
      } else {
        // Create new health profile
        const { error: insertError } = await supabase
          .from('patient_health_profile')
          .insert({
            profile_id: userId,
            alergies: formData.allergies,
            organ_donor: formData.organDonor,
            blood_donor: formData.bloodDonor
          })

        if (insertError) {
          console.error('[ONBOARDING] Health profile insert failed:', insertError)
          throw insertError
        }
      }

      setSaving(false)
      return true
    } catch (err) {
      console.error('[ONBOARDING] Error saving data:', err)
      setSaving(false)
      throw err
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
