import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doctorApi } from '../services/doctorApi'
import { Button } from '../components/ui/button'

type PatientItem = {
  patient_id: string
  name: string
  health_plan: string | null
  access_scope: string
  consent: boolean
  expires_at: string | null
}

export default function DoctorDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState<PatientItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const res = await doctorApi.getAuthorizedPatients()
        setPatients(res.patients || [])
      } catch (e: any) {
        setError(e?.error || 'Falha ao carregar')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Pacientes Autorizados</h1>
      {patients.length === 0 && <div className="text-gray-600">Nenhum paciente com acesso ativo.</div>}
      <div className="space-y-3">
        {patients.map(p => (
          <div key={p.patient_id} className="bg-white rounded border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name || 'Sem nome'}</div>
              <div className="text-sm text-gray-600">Plano: {p.health_plan || '—'} • Escopo: {p.access_scope} • Consentimento: {p.consent ? 'Sim' : 'Não'}</div>
            </div>
            <Button onClick={() => navigate(`/doctor/patients/${p.patient_id}`)} size="sm">Ver Perfil Clínico</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
