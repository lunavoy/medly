import React, { useEffect, useState } from 'react';
import { Heart, Calendar, FileText, Clock, Shield, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAppointments, useExams } from '../hooks/useSupabase';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';

interface DashboardOverviewProps {
  user?: any;
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const navigate = useNavigate();
  const { appointments, loading: loadingAppts } = useAppointments();
  const { exams, loading: loadingExams } = useExams();
  const [ageInfo, setAgeInfo] = useState<{ full_name?: string; age?: number } | null>(null);
  const [loadingAge, setLoadingAge] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAge = async () => {
      if (!user) {
        // fetch first available record as fallback
        const { data } = await supabase.from('age_of_user').select('full_name, age').limit(1).maybeSingle();
        setAgeInfo(data ?? null);
        setLoadingAge(false);
        return;
      }

      const name = user?.full_name ?? user?.name;
      if (!name) {
        setLoadingAge(false);
        return;
      }

      const { data } = await supabase.from('age_of_user').select('full_name, age').eq('full_name', name).maybeSingle();
      setAgeInfo(data ?? null);
      setLoadingAge(false);
    };

    fetchAge();
  }, [user]);

  const formatAppointmentDate = (startDatetime: string) => {
    const date = new Date(startDatetime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate.getTime() === today.getTime()) {
      return 'Hoje';
    }

    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const formatAppointmentTime = (startDatetime: string) => {
    const date = new Date(startDatetime);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loadingAppts || loadingExams || loadingAge) return <div>Carregando...</div>;

  /*
  const healthMetrics = [
    {
      label: 'Pressão Arterial',
      value: '120/80',
      status: 'normal',
      icon: Heart,
      trend: 'stable'
    },
    {
      label: 'Frequência Cardíaca',
      value: '72 bpm',
      status: 'normal',
      icon: Heart,
      trend: 'down'
    },
    {
      label: 'Glicose',
      value: '95 mg/dL',
      status: 'normal',
      icon: TrendingUp,
      trend: 'stable'
    },
    {
      label: 'Peso',
      value: '68 kg',
      status: 'normal',
      icon: TrendingUp,
      trend: 'down'
    }
  ];
  */

  const recentExams = [
    {
      name: 'Hemograma Completo',
      date: '15/09/2024',
      status: 'Resultados Normais',
      urgent: false
    },
    {
      name: 'Eletrocardiograma',
      date: '10/09/2024',
      status: 'Pendente Revisão',
      urgent: true
    },
    {
      name: 'Raio-X Tórax',
      date: '05/09/2024',
      status: 'Resultados Normais',
      urgent: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-teal-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-gray-900">Bem-vindo, {user?.full_name || user?.name || 'usuário'}!</CardTitle>
            <p className="text-lg text-gray-600">Como está se sentindo hoje?</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZG9jdG9yJTIwY29uc3VsdGF0aW9uJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTk4Nzg5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Healthcare consultation"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">{ageInfo?.age ?? user?.age ?? '—'} anos</p>
                <p className="text-sm text-gray-500">Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR').replace(/\//g, '/') : (user?.memberSince || user?.member_since || '—')}</p>
                <Badge className="mt-2 bg-teal-100 text-teal-700 hover:bg-teal-200">
                  <Shield className="w-4 h-4 mr-1" />
                  {user?.healthPlan || user?.health_plan}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-cyan-600" />
                Próximas Consultas
              </div>
              <span className="text-base font-semibold text-cyan-700">{(appointments?.filter((a: any) => a.status !== 'cancelada')?.length) ?? 0}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto space-y-4">
              {appointments && appointments.filter((a: any) => a.status !== 'cancelada').length > 0 ? (
                appointments
                  .filter((appointment: any) => appointment.status !== 'cancelada')
                  .map((appointment: any, index: number) => {
                  const prefix = appointment.doctor?.gender === 'M' ? 'Dr.' : 'Dra.';
                  
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'agendada':
                        return 'bg-blue-100 text-blue-700';
                      case 'confirmada':
                        return 'bg-green-100 text-green-700';
                      case 'cancelada':
                        return 'bg-red-100 text-red-700';
                      default:
                        return 'bg-gray-100 text-gray-700';
                    }
                  };

                  const getStatusLabel = (status: string) => {
                    const labels: Record<string, string> = {
                      agendada: 'Agendada',
                      confirmada: 'Confirmada',
                      cancelada: 'Cancelada',
                    };
                    return labels[status] || status;
                  };

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {prefix} {appointment.doctor?.full_name || 'Médico'}
                        </p>
                        <p className="text-base text-gray-600">
                          {appointment.doctor?.specialty_id?.specialty || 'Especialidade'}
                        </p>
                        <p className={`text-xs font-semibold mt-2 px-2 py-1 rounded w-fit ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-cyan-700">
                          {formatAppointmentDate(appointment.start_datetime)}, {formatAppointmentTime(appointment.start_datetime)}
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 bg-cyan-600 hover:bg-cyan-700"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setModalOpen(true);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-cyan-50 rounded-lg text-center text-gray-600">
                  Nenhuma consulta agendada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card className="border-cyan-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-6 h-6 mr-3 text-cyan-600" />
              Exames Recentes
            </div>
            <span className="text-base font-semibold text-cyan-700">{exams?.length ?? 0}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-cyan-50 rounded-lg text-center text-gray-600">
            Nenhum exame feito recentemente
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-teal-600" />
            Seus Dados de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-gray-900">Integração com Google Fit em breve</p>
              <p className="text-sm text-gray-600">Sincronize seus dados de atividade diretamente do Google Fit.</p>
            </div>
            <Settings className="w-10 h-10 text-teal-600" />
          </div>
        </CardContent>
      </Card>

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedAppointment(null);
          }}
          onStatusChange={() => {
            // Refresh appointments by re-rendering
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}