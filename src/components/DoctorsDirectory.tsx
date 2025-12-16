import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '../supabase/client';

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
  ratingAvg?: number | null;
  ratingCount?: number;
  nextAvailableText?: string | null;
};

function DoctorsDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      // Fetch doctors
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select(
          `id, full_name, gender, crm_number, crm_state, specialty:specialty_id(specialty), clinic:clinics(trade_name,adress,phone_number), photo_url`
        )
        .order('full_name', { ascending: true });

      if (doctorError) {
        console.error('Erro ao carregar médicos:', doctorError);
        setError(doctorError.message || 'Falha ao carregar médicos');
        setLoading(false);
        return;
      }

      // Fetch ratings separately (no FK relation available in cache)
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('doctor_id, rating');

      if (ratingsError) {
        console.error('Erro ao carregar avaliações:', ratingsError);
        // proceed without ratings
      }

      const doctorIds = (doctorData || []).map((d) => d.id);

      // Fetch schedules for next-available slot
      const { data: schedulesData, error: schedulesError } = doctorIds.length
        ? await supabase
            .from('doctor_schedule')
            .select('doctor_id, weekday, start_time, end_time')
            .in('doctor_id', doctorIds)
        : { data: [], error: null };

      if (schedulesError) {
        console.error('Erro ao carregar horários:', schedulesError);
      }

      const scheduleMap = new Map<string | number, Array<{ weekday: number; start_time: string; end_time: string }>>();
      (schedulesData || []).forEach((s: any) => {
        const arr = scheduleMap.get(s.doctor_id) || [];
        arr.push({ weekday: Number(s.weekday), start_time: s.start_time, end_time: s.end_time });
        scheduleMap.set(s.doctor_id, arr);
      });

      const ratingMap = new Map<string | number, { sum: number; count: number }>();
      (ratingsData || []).forEach((r: any) => {
        const key = r.doctor_id;
        const current = ratingMap.get(key) || { sum: 0, count: 0 };
        ratingMap.set(key, { sum: current.sum + (r.rating ?? 0), count: current.count + 1 });
      });

      const findNextSlot = (
        schedules: Array<{ weekday: number; start_time: string; end_time: string }>
      ): string | null => {
        if (!schedules || schedules.length === 0) return null;
        const now = new Date();

        const parseTime = (time: string) => {
          const [h, m] = time.split(':').map(Number);
          return { h, m };
        };

        const formatLabel = (slot: Date) => {
          const timeStr = slot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dayToCheck = new Date(slot);
          dayToCheck.setHours(0, 0, 0, 0);

          if (dayToCheck.getTime() === today.getTime()) return `hoje às ${timeStr}`;

          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (dayToCheck.getTime() === tomorrow.getTime()) return `amanhã às ${timeStr}`;

          const dateStr = slot.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          return `${dateStr} às ${timeStr}`;
        };

        for (let offset = 0; offset < 30; offset++) {
          const day = new Date(now);
          day.setDate(day.getDate() + offset);
          const weekday = day.getDay();
          const matches = schedules.filter((s) => Number(s.weekday) === weekday);
          if (matches.length === 0) continue;

          for (const s of matches) {
            const { h: sh, m: sm } = parseTime(s.start_time);
            const { h: eh, m: em } = parseTime(s.end_time);

            let cursor = new Date(day);
            cursor.setHours(sh, sm, 0, 0);

            const end = new Date(day);
            end.setHours(eh, em, 0, 0);

            while (cursor < end) {
              if (cursor > now) {
                return formatLabel(cursor);
              }
              cursor = new Date(cursor.getTime() + 30 * 60 * 1000);
            }
          }
        }

        return null;
      };

      const doctorsWithRatings = (doctorData || []).map((d: any) => {
        const stats = ratingMap.get(d.id) || { sum: 0, count: 0 };
        const ratingAvg = stats.count ? parseFloat((stats.sum / stats.count).toFixed(1)) : null;
        const schedules = scheduleMap.get(d.id) || [];
        const nextAvailableText = findNextSlot(schedules);
        return {
          ...d,
          ratingAvg,
          ratingCount: stats.count,
          nextAvailableText,
        } as Doctor;
      });

      setDoctors(doctorsWithRatings);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando médicos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const specialties = Array.from(
    new Set(
      doctors
        .map((d) => d.specialty?.specialty)
        .filter((s): s is string => Boolean(s))
    )
  ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const filteredDoctors = specialtyFilter
    ? doctors.filter((d) => d.specialty?.specialty === specialtyFilter)
    : doctors;

  const selectedRatingCount = selectedDoctor?.ratingCount ?? 0;
  const selectedRatingAvg = selectedRatingCount
    ? selectedDoctor?.ratingAvg?.toFixed?.(1) ?? selectedDoctor?.ratingAvg
    : '—';

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h2 className="text-xl font-semibold text-gray-900">Selecione um médico para ver mais detalhes</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 w-full">
            {specialties.length > 0 && (
              <div className="flex items-center gap-2 md:ml-auto md:justify-end">
                <label className="text-sm text-gray-700">Especialidade:</label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                >
                  <option value="">Todas</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {filteredDoctors.map((doc) => {
        const prefix = doc.gender === 'M' ? 'Dr.' : 'Dra.';
        const ratingCount = doc.ratingCount ?? 0;
        const ratingAvg = ratingCount ? doc.ratingAvg?.toFixed?.(1) ?? doc.ratingAvg : '—';
        const photoSrc = doc.photo_url || 'https://images.unsplash.com/photo-1659019479972-82d9e3e8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

        return (
          <Card
            key={doc.id}
            className="border-transparent shadow-sm hover:shadow-md transition-shadow duration-200 bg-white hover:bg-gray-50"
          >
            <CardContent className="p-4">
              <div className="group rounded-lg transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-100 flex-shrink-0 border border-teal-200 shadow-inner">
                    <img src={photoSrc} alt={doc.full_name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {prefix} {doc.full_name}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="flex items-center gap-2"><span>🩺</span><span>{doc.specialty?.specialty || 'Especialidade não informada'}</span></div>
                      <div className="flex items-center gap-2 text-amber-700 font-semibold"><span>⭐</span><span>{ratingAvg} ({ratingCount} avaliações)</span></div>
                      <div className="flex items-center gap-2 text-teal-800">
                        <span>📍</span>
                        <span>{doc.clinic?.adress || 'Local não informado'} · {doc.clinic?.trade_name || 'Clínica não informada'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <span>🟢</span>
                        <span>Próximo horário: {doc.nextAvailableText || 'Sem horários próximos'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="border-teal-300 text-teal-700 hover:bg-teal-50"
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      Ver Informações
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {filteredDoctors.length === 0 && (
        <Card>
          <CardContent className="text-center text-gray-600">Nenhum médico encontrado.</CardContent>
        </Card>
      )}

      {selectedDoctor && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDoctor(null);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 animate-scale-in relative border border-teal-100/60">
            <button
              aria-label="Fechar"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setSelectedDoctor(null)}
            >
              ×
            </button>

            <div className="space-y-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="text-2xl font-semibold text-gray-900">
                  {selectedDoctor.gender === 'M' ? 'Dr.' : 'Dra.'} {selectedDoctor.full_name}
                </div>
                <div className="text-base text-gray-600">
                  {selectedDoctor.specialty?.specialty || 'Especialidade não informada'}
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  CRM: {selectedDoctor.crm_number ? `${selectedDoctor.crm_number}${selectedDoctor.crm_state ? ` - ${selectedDoctor.crm_state}` : ''}` : 'Não informado'}
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-teal-50 flex-shrink-0 border border-teal-200 shadow-inner">
                  <img
                    src={selectedDoctor.photo_url || 'https://images.unsplash.com/photo-1659019479972-82d9e3e8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'}
                    alt={selectedDoctor.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3 text-base text-gray-800">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold">
                    <span>⭐</span>
                    <span>{selectedRatingAvg} ({selectedRatingCount} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-800">
                    <span>📍</span>
                    <span>{selectedDoctor.clinic?.adress || 'Local não informado'} · {selectedDoctor.clinic?.trade_name || 'Clínica não informada'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <span>🟢</span>
                    <span>Próximo horário: {selectedDoctor.nextAvailableText || 'Sem horários próximos'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>☎️</span>
                    <span>{selectedDoctor.clinic?.phone_number || 'Telefone não informado'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsDirectory;
export { DoctorsDirectory };