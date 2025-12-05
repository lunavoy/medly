import React from 'react';
import { CheckCircle, Calendar as CalendarIcon, Home, Share2, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { toast } from 'sonner@2.0.3';

interface AppointmentData {
  specialty: string;
  date: Date | null;
  time: string;
  patientName: string;
  reason: string;
}

interface AppointmentStep6Props {
  data: AppointmentData;
  onFinish: () => void;
}

export function AppointmentStep6({ data, onFinish }: AppointmentStep6Props) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleAddToCalendar = () => {
    toast.success('Evento adicionado ao calendário!');
    // In a real app, this would trigger calendar API
  };

  const handleShare = () => {
    const message = `✅ Consulta agendada!\n\n📋 ${data.specialty}\n📅 ${data.date ? formatDate(data.date) : ''}\n⏰ ${data.time}\n👨‍⚕️ Dr. Paulo Juvenal Alves\n\n${data.reason}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Consulta Agendada',
        text: message,
      }).catch(() => {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(message);
        toast.success('Detalhes copiados para a área de transferência!');
      });
    } else {
      navigator.clipboard.writeText(message);
      toast.success('Detalhes copiados para a área de transferência!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Icon and Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl animate-[bounce_1s_ease-in-out_1]">
            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-gray-900">
            Consulta agendada com sucesso!
          </h3>
          <p className="text-lg text-gray-600 mt-2">
            Seu agendamento foi confirmado
          </p>
        </div>
      </div>

      {/* Mini Summary Card */}
      <Card className="border-4 border-green-500 shadow-xl">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-t-lg">
          <h4 className="text-xl font-semibold">Detalhes da Consulta</h4>
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-base text-gray-600">Especialidade</span>
            <span className="text-lg font-semibold text-gray-900">{data.specialty}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-base text-gray-600">Médico</span>
            <span className="text-lg font-semibold text-gray-900">Dr. Paulo Juvenal Alves</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-base text-gray-600">Data</span>
            <span className="text-lg font-semibold text-gray-900 capitalize">
              {data.date && formatDate(data.date)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-base text-gray-600">Horário</span>
            <span className="text-lg font-semibold text-gray-900">{data.time}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-base text-gray-600">Paciente</span>
            <span className="text-lg font-semibold text-gray-900">{data.patientName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Reminders Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300">
        <CardContent className="p-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Lembretes ativados</p>
              <p className="text-sm text-gray-700 mt-1">
                Você receberá notificações 48h e 2h antes da consulta
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Button
          onClick={handleAddToCalendar}
          className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
        >
          <CalendarIcon className="w-5 h-5 mr-2" />
          Adicionar ao calendário
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-2 border-teal-300 text-teal-700 hover:bg-teal-50 py-6 text-lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Compartilhar
        </Button>
      </div>

      {/* Main Action Button */}
      <Button
        onClick={onFinish}
        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-7 text-xl font-semibold shadow-lg"
      >
        <Home className="w-6 h-6 mr-2" />
        Voltar para o início
      </Button>

      {/* Additional Info */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Você pode visualizar e gerenciar suas consultas na página inicial
        </p>
      </div>
    </div>
  );
}
