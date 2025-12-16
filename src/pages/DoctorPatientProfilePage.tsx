import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doctorApi } from '../services/doctorApi'

export default function DoctorPatientProfilePage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await doctorApi.getPatientProfile(id!)
        setData(res)
      } catch (e: any) {
        setError(e?.error || 'Acesso negado')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Perfil Clínico</h1>
      <div className="bg-white border rounded p-4 mb-4">
        <div className="font-medium">{data?.patient?.name}</div>
        <div className="text-sm text-gray-600">Idade: {data?.patient?.age ?? '—'} • Plano: {data?.patient?.health_plan ?? '—'}</div>
      </div>
      {data?.clinical_profile ? (
        <div className="space-y-3">
          <div className="bg-white border rounded p-4">
            <div className="font-medium mb-2">Dados Sensíveis</div>
            <div className="text-sm text-gray-700">Tipo Sanguíneo ID: {data?.clinical_profile?.blood_type_id ?? '—'}</div>
            <div className="text-sm text-gray-700">Doador de Órgãos: {String(data?.clinical_profile?.organ_donor ?? '—')}</div>
            <div className="text-sm text-gray-700">Doador de Sangue: {String(data?.clinical_profile?.blood_donor ?? '—')}</div>
            <div className="text-sm text-gray-700">Alergias: {data?.clinical_profile?.alergies ?? '—'}</div>
          </div>
          <div className="bg-white border rounded p-4">
            <div className="font-medium mb-2">Comorbidades</div>
            <div className="space-y-1">
              {(data?.clinical_profile?.comorbidities ?? []).map((c: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-700">{c.name} • origem: {c.source ?? '—'} • confirmado: {c.confirmed_at ?? '—'}</div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-600">Escopo limitado: dados clínicos não disponíveis.</div>
      )}
      <div className="text-xs text-gray-500 mt-6">
        As informações exibidas foram compartilhadas pelo paciente e estão protegidas pela LGPD.
      </div>
    </div>
  )
}
