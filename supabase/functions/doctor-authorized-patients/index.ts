// Deno Edge Function: doctor-authorized-patients
// Lists patients a doctor currently has active access to.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } }
    })
    const { data: userData, error: userErr } = await authClient.auth.getUser()
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
    const doctorId = userData.user.id

    const service = createClient(SUPABASE_URL, SERVICE_ROLE)

    // Verify doctor
    const { data: doctorRow } = await service
      .from('doctors')
      .select('id')
      .eq('id', doctorId)
      .maybeSingle()
    if (!doctorRow) {
      return new Response(JSON.stringify({ error: 'forbidden: not a doctor' }), { status: 403 })
    }

    const { data: rows, error } = await service
      .from('doctor_patient_access')
      .select('patient:patient_id(id, full_name, health_plan), access_scope, explicit_consent, consultation, emergency, expires_at)')
      .eq('doctor_id', doctorId)
      .eq('is_active', true)

    if (error) {
      return new Response(JSON.stringify({ error: 'query_failed', details: error }), { status: 500 })
    }

    const list = (rows ?? []).map((r: any) => ({
      patient_id: r?.patient?.id,
      name: r?.patient?.full_name,
      health_plan: r?.patient?.health_plan,
      access_scope: r?.access_scope,
      consent: !!(r?.explicit_consent || r?.consultation || r?.emergency),
      expires_at: r?.expires_at ?? null
    }))

    return new Response(JSON.stringify({ patients: list }), {
      headers: { 'content-type': 'application/json' },
      status: 200
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'internal_error', details: String(e) }), { status: 500 })
  }
})
