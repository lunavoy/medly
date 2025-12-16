import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '../supabase/client';
import { useAuth } from '../AuthProvider';
import { Calendar, Plus } from 'lucide-react';

type Doctor = {
  id: string | number;
  full_name: string;
  gender?: 'M' | 'F';
  crm_number?: string | null;
  crm_state?: string | null;
  specialty?: { specialty: string } | null;
  clinic?: { trade_name?: string; adress?: string; phone_number?: string } | null;
  photo_url?: string;
  image?: string;
};

type DoctorsDirectoryProps = {
  onOpenAppointmentFlow?: () => void;
};

function DoctorsDirectory({ onOpenAppointmentFlow }: DoctorsDirectoryProps) {
  const { user } = useAuth();
  const [doctorsBySpecialty, setDoctorsBySpecialty] = useState<Map<string, Doctor[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultedDoctors = async () => {
      setLoading(true);
      setError(null);

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all appointments for the user
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('doctor_id')
          .eq('patient_id', user.id);

        if (appointmentsError) {
          console.error('Erro ao carregar agendamentos:', appointmentsError);
          setError('Falha ao carregar histórico de consultas');
          setLoading(false);
          return;
        }

        if (!appointments || appointments.length === 0) {
          setDoctorsBySpecialty(new Map());
          setLoading(false);
          return;
        }

        // Get unique doctor IDs
        const uniqueDoctorIds = Array.from(new Set(appointments.map((a: any) => a.doctor_id)));

        // Fetch doctor details with specialty and clinic info
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select(
            `id, full_name, gender, crm_number, crm_state, specialty:specialty_id(specialty), clinic:clinics(trade_name,adress,phone_number), photo_url`
          )
          .in('id', uniqueDoctorIds);

        if (doctorsError) {
          console.error('Erro ao carregar médicos:', doctorsError);
          setError('Falha ao carregar informações dos médicos');
          setLoading(false);
          return;
        }

        // Deduplicate doctors by ID
        const normalizeId = (value: any) => String(value);
        const uniqueDoctors = Array.from(
          new Map((doctorsData || []).map((doc: any) => [normalizeId(doc.id), doc])).values()
        );

        // Group doctors by specialty
        const grouped = new Map<string, Doctor[]>();
        uniqueDoctors.forEach((doctor: any) => {
          const specialty = doctor.specialty?.specialty || 'Sem especialidade';
          if (!grouped.has(specialty)) {
            grouped.set(specialty, []);
          }
          grouped.get(specialty)!.push(doctor);
        });

        // Sort specialties alphabetically
        const sortedGrouped = new Map(
          Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
        );

        setDoctorsBySpecialty(sortedGrouped);
        setLoading(false);
      } catch (err) {
        console.error('Erro:', err);
        setError('Erro ao carregar dados');
        setLoading(false);
      }
    };

    fetchConsultedDoctors();
  }, [user]);

  if (loading) {
    return <div className="p-6 text-center">Carregando histórico de consultas...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 text-center">{error}</div>;
  }

  if (doctorsBySpecialty.size === 0) {
    return (
      <div className="space-y-6">
        <div className="px-1">
          <h2 className="text-xl font-semibold text-gray-900">Meus Médicos</h2>
        </div>

        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center space-y-4">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-gray-600">
                Você ainda não se consultou com nenhum médico
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Agende sua primeira consulta e comece a cuidar da sua saúde
              </p>
            </div>
            <Button
              onClick={onOpenAppointmentFlow}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg mt-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agendar primeira consulta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="px-1">
        <h2 className="text-xl font-semibold text-gray-900">Meus Médicos</h2>
        <p className="text-sm text-gray-600 mt-1">
          {Array.from(doctorsBySpecialty.values()).reduce((sum, doctors) => sum + doctors.length, 0)} médicos consultados
        </p>
      </div>

      {Array.from(doctorsBySpecialty.entries()).map(([specialty, doctors]) => (
        <div key={specialty} className="space-y-3">
          <div className="px-1">
            <h3 className="text-lg font-semibold text-teal-700">🩺 {specialty}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => {
              const prefix = doc.gender === 'M' ? 'Dr.' : 'Dra.';
              const photoSrc = doc.photo_url || 'https://images.unsplash.com/photo-1659019479972-82d9e3e8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

              return (
                <Card
                  key={doc.id}
                  className="border-transparent shadow-sm hover:shadow-md transition-shadow duration-200 bg-white hover:bg-gray-50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-100 flex-shrink-0 border border-teal-200 shadow-inner">
                        <img src={photoSrc} alt={doc.full_name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {prefix} {doc.full_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {doc.specialty?.specialty || 'Especialidade não informada'}
                          </p>
                        </div>

                        {doc.clinic && (
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>📍 {doc.clinic.trade_name || 'Clínica não informada'}</p>
                            {doc.clinic.phone_number && (
                              <p>☎️ {doc.clinic.phone_number}</p>
                            )}
                          </div>
                        )}

                        {doc.crm_number && (
                          <p className="text-xs text-gray-500">
                            CRM: {doc.crm_number}{doc.crm_state ? ` - ${doc.crm_state}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-gray-200">
        <Button
          onClick={onOpenAppointmentFlow}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-6 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agendar nova consulta
        </Button>
      </div>
    </div>
  );
}

export default DoctorsDirectory;
export { DoctorsDirectory };