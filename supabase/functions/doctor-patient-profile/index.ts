// Deno Edge Function: doctor-patient-profile
// Validates doctor auth, checks access link and consent/scope, returns filtered patient data and writes audit log.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type AccessScope = 'basic' | 'clinical' | 'full'

serve(async (req) => {
  try {
    const url = new URL(req.url)
    const patientId = url.searchParams.get('patient_id')
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || ''

    if (!patientId) {
      return new Response(JSON.stringify({ error: 'patient_id required' }), { status: 400 })
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Client to read the JWT user (propagate auth header)
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } }
    })
    const { data: userData, error: userErr } = await authClient.auth.getUser()
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
    const doctorId = userData.user.id

    // Service role client to enforce access checks and bypass RLS
    const service = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Verify doctor exists
    const { data: doctorRow, error: docErr } = await service
      .from('doctors')
      .select('id, full_name')
      .eq('id', doctorId)
      .maybeSingle()
    if (docErr || !doctorRow) {
      return new Response(JSON.stringify({ error: 'forbidden: not a doctor' }), { status: 403 })
    }

    // Check active access
    const { data: access, error: accessErr } = await service
      .from('doctor_patient_access')
      .select('access_scope, explicit_consent, consultation, emergency, is_active, expires_at')
      .eq('doctor_id', doctorId)
      .eq('patient_id', patientId)
      .eq('is_active', true)
      .maybeSingle()

    if (accessErr || !access) {
      return new Response(JSON.stringify({ error: 'no active access' }), { status: 403 })
    }

    if (access.expires_at && new Date(access.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'access expired' }), { status: 403 })
    }

    const hasConsent = !!(access.explicit_consent || access.consultation || access.emergency)
    if (!hasConsent) {
      return new Response(JSON.stringify({ error: 'no consent' }), { status: 403 })
    }

    const scope = (access.access_scope as AccessScope) || 'basic'

    // Fetch patient basic profile
    const { data: patientProfile, error: profileErr } = await service
      .from('profiles')
      .select('id, full_name, birth_date, health_plan')
      .eq('id', patientId)
      .maybeSingle()
    if (profileErr || !patientProfile) {
      return new Response(JSON.stringify({ error: 'patient not found' }), { status: 404 })
    }

    // Fetch clinical profile conditionally
    let clinical: Record<string, unknown> | null = null
    if (scope === 'clinical' || scope === 'full') {
      const { data: hp } = await service
        .from('patient_health_profile')
        .select('blood_type_id, organ_donor, blood_donor, alergies')
        .eq('profile_id', patientId)
        .maybeSingle()

      // Comorbidities (optional list)
      const { data: comorb } = await service
        .from('patient_comorbidities')
        .select('comorbidity:comorbidities(name), source, confirmed_at')
        .eq('profile_id', patientId)

      clinical = {
        blood_type_id: hp?.blood_type_id ?? null,
        organ_donor: hp?.organ_donor ?? null,
        blood_donor: hp?.blood_donor ?? null,
        alergies: hp?.alergies ?? null,
        comorbidities: (comorb ?? []).map((c: any) => ({
          name: c?.comorbidity?.name ?? null,
          source: c?.source ?? null,
          confirmed_at: c?.confirmed_at ?? null
        }))
      }
    }

    const response: Record<string, unknown> = {
      patient: {
        name: patientProfile.full_name,
        age: patientProfile.birth_date ? Math.floor((Date.now() - new Date(patientProfile.birth_date).getTime()) / (365.25*24*3600*1000)) : null,
        health_plan: patientProfile.health_plan ?? null
      }
    }
    if (scope === 'full') {
      response['clinical_profile'] = clinical
    } else if (scope === 'clinical') {
      // Limit subset for clinical
      const c = clinical || {}
      response['clinical_profile'] = {
        blood_type_id: (c as any).blood_type_id ?? null,
        organ_donor: (c as any).organ_donor ?? null,
        blood_donor: (c as any).blood_donor ?? null,
        comorbidities: (c as any).comorbidities ?? []
      }
    } // basic -> no clinical block

    // Audit log
    await service.from('medical_access_logs').insert({
      doctor_id: doctorId,
      patient_id: patientId,
      action: 'VIEW_PROFILE',
      ip_address: ip
    })

    return new Response(JSON.stringify(response), {
      headers: { 'content-type': 'application/json' },
      status: 200
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'internal_error', details: String(e) }), { status: 500 })
  }
})
