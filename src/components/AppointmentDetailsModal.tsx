import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { supabase } from '../supabase/client';
import { toast } from 'sonner';

interface AppointmentDetailsModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
}: AppointmentDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !appointment) return null;

  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id);

      if (error) {
        console.error('Error updating appointment:', error);
        toast.error('Erro ao atualizar consulta');
        return;
      }

      toast.success(`Consulta ${newStatus} com sucesso!`);
      onStatusChange();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao atualizar consulta');
    } finally {
      setLoading(false);
    }
  };

  const prefix = appointment.doctor?.gender === 'F' ? 'Dra.' : 'Dr.';
  const crmNumber = appointment.doctor?.crm_number || 'N/A';
  const crmState = appointment.doctor?.crm_state || '';
  const crm = crmState ? `${crmNumber} - ${crmState}` : crmNumber;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl border-0">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-semibold">Detalhes da Consulta</h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Doctor Info - Top */}
          <div className="space-y-3 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-600">MÉDICO</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {prefix} {appointment.doctor?.full_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">ESPECIALIDADE</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {appointment.doctor?.specialty_id?.specialty}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">CRM</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{crm}</p>
            </div>
          </div>

          {/* Appointment Details - Bottom */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-600">DATA</p>
              <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                {formatDate(appointment.start_datetime)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">HORÁRIO</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {formatTime(appointment.start_datetime)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">STATUS</p>
              <p className="text-lg font-semibold text-cyan-700 mt-1 capitalize">
                {appointment.status}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => handleStatusChange('confirmada')}
              disabled={loading}
              style={{ backgroundColor: '#16a34a', color: 'white' }}
              className="flex-1 hover:bg-green-700 font-semibold py-3 text-base"
            >
              Confirmar
            </Button>
            <Button
              onClick={() => handleStatusChange('cancelada')}
              disabled={loading}
              style={{ backgroundColor: '#dc2626', color: 'white' }}
              className="flex-1 hover:bg-red-700 font-semibold py-3 text-base"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
