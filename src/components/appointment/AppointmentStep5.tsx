import React, { useEffect } from 'react';
import { useUserProfile } from '../../hooks/useSupabase';
import { Calendar, Clock, User, FileText, Stethoscope, Bell, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface AppointmentData {
  specialty: string;
  date: Date | null;
  time: string;
  patientName: string;
  patientCPF: string;
  phone: string;
  reason: string;
  isReturn: boolean;
  lastVisitDate?: string;
}

interface AppointmentStep5Props {
  data: AppointmentData;
  onConfirm: () => void;
  onBack: () => void;
}

export function AppointmentStep5({ data, onConfirm, onBack }: AppointmentStep5Props) {
  const { profile } = useUserProfile();
  useEffect(() => {
    if (profile) {
      // Ensure summary shows up-to-date profile fields
      data.patientName = profile.full_name;
      data.patientCPF = profile.cpf;
    }
  }, [profile]);
  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    // Handle case where date might be a string
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '—';
    return dateObj.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Confirme os dados da consulta
        </h3>
        <p className="text-lg text-gray-600">
          Revise todas as informações antes de confirmar
        </p>
      </div>

      {/* Summary Card - Ticket Style */}
      <Card className="border-4 border-teal-500 shadow-xl">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Resumo da Consulta</h4>
                <p className="text-teal-100">Dr. Paulo Juvenal Alves</p>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-4">
          {/* Specialty */}
          <div className="flex items-start space-x-4 p-4 bg-teal-50 rounded-lg">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Especialidade</p>
              <p className="text-lg font-semibold text-gray-900">{data.specialty}</p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {data.date && formatDate(data.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-cyan-50 rounded-lg">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horário</p>
                <p className="text-lg font-semibold text-gray-900">{data.time}</p>
              </div>
            </div>
          </div>

          {/* Patient */}
          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="text-lg font-semibold text-gray-900">{data.patientName}</p>
              <p className="text-sm text-gray-600 mt-1">CPF: {data.patientCPF}</p>
              <p className="text-sm text-gray-600">Tel: {data.phone}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Motivo da consulta</p>
              <p className="text-base text-gray-900 mt-1">{data.reason}</p>
              {data.isReturn && data.lastVisitDate && (
                <p className="text-sm text-teal-600 mt-2">
                  Retorno - Última consulta: {new Date(data.lastVisitDate).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center space-x-2 p-3 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border-2 border-teal-200"
          >
            <Edit className="w-5 h-5" />
            <span className="font-medium">Alterar horário</span>
          </button>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <CardContent className="p-5">
          <div className="flex items-start space-x-3">
            <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-base text-gray-900 font-medium">
                Lembretes automáticos
              </p>
              <p className="text-base text-gray-700 mt-1">
                Você receberá lembretes por SMS e notificação 48h e 2h antes da consulta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-7 text-xl font-semibold shadow-lg"
        >
          Confirmar agendamento
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full border-gray-300 text-gray-700 py-6 text-lg"
        >
          Voltar para alterar dados
        </Button>
      </div>
    </div>
  );
}
