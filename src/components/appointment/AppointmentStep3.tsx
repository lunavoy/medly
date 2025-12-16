import React, { useEffect, useState } from 'react';
import { Clock, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { supabase } from '../../supabase/client';

interface AppointmentStep3Props {
  selectedDoctor: string;
  selectedDoctorId: string | number;
  selectedDate: Date | null;
  selectedTime: string;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

type DoctorSchedule = {
  weekday: number;
  start_time: string;
  end_time: string;
};

type Appointment = {
  date: string;
  time: string;
  doctor: string;
};

type ScheduleException = {
  date: string;
  time: string;
  doctor_full_name: string;
};

export function AppointmentStep3({ 
  selectedDoctor, 
  selectedDoctorId,
  selectedDate, 
  selectedTime, 
  onSelect, 
  onNext, 
  onBack 
}: AppointmentStep3Props) {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !selectedDoctor) {
        setLoading(false);
        return;
      }

      // Convert string date to Date object if necessary
      const dateObj = selectedDate instanceof Date ? selectedDate : new Date(selectedDate as any);
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date:', selectedDate);
        setLoading(false);
        return;
      }

      console.log('Fetching slots for:', selectedDoctor, 'Date:', dateObj);

      try {
        // Get doctor's schedule for this day of week
        const dayOfWeekNumber = dateObj.getDay();
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('doctor_schedule')
          .select('start_time, end_time')
          .eq('doctor_id', selectedDoctorId)
          .eq('weekday', dayOfWeekNumber);

        console.log('Schedule error:', scheduleError);
        console.log('Schedule data:', scheduleData);

        if (scheduleError || !scheduleData || scheduleData.length === 0) {
          setTimeSlots([]);
          setLoading(false);
          return;
        }

        // Generate time slots (30-minute intervals)
        const schedule = scheduleData[0];
        const slots = generateTimeSlots(schedule.start_time, schedule.end_time);
        console.log('Generated slots:', slots);

        // Get booked appointments for this date
        const dateStr = dateObj.toISOString().split('T')[0];
        const { data: appointments, error: appointmentError } = await supabase
          .from('appointments')
          .select('start_datetime')
          .eq('doctor_id', selectedDoctorId)
          .gte('start_datetime', `${dateStr}T00:00:00`)
          .lt('start_datetime', `${dateStr}T23:59:59`);

        console.log('Appointment error:', appointmentError);
        console.log('Appointments:', appointments);

        // Get schedule exceptions for this date
        const { data: exceptions, error: exceptionError } = await supabase
          .from('doctor_schedule_exceptions')
          .select('start_datetime')
          .eq('doctor_id', selectedDoctorId)
          .gte('start_datetime', `${dateStr}T00:00:00`)
          .lt('start_datetime', `${dateStr}T23:59:59`);

        console.log('Exception error:', exceptionError);
        console.log('Exceptions:', exceptions);

        // Build list of unavailable slots
        const unavailable = new Set<string>();
        
        if (appointments && appointments.length > 0) {
          appointments.forEach(apt => {
            const time = new Date(apt.start_datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            unavailable.add(time);
          });
        }

        if (exceptions && exceptions.length > 0) {
          exceptions.forEach(exc => {
            const time = new Date(exc.start_datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            unavailable.add(time);
          });
        }

        // Remove past times if it's today
        const now = new Date();
        const isToday = dateObj.toDateString() === now.toDateString();
        
        if (isToday) {
          slots.forEach(slot => {
            const [hours, minutes] = slot.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(hours, minutes, 0);
            
            if (slotTime <= now) {
              unavailable.add(slot);
            }
          });
        }

        setTimeSlots(slots);
        setUnavailableSlots(Array.from(unavailable));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDoctorId, selectedDate]);

  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    const endTotalMin = endHour * 60 + endMin;
    
    while (currentHour * 60 + currentMin < endTotalMin) {
      slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return slots;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '—';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '—';
    return dateObj.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderTimeSlot = (time: string) => {
    const isUnavailable = unavailableSlots.includes(time);
    const isSelected = selectedTime === time;

    return (
      <button
        key={time}
        disabled={isUnavailable}
        onClick={() => onSelect(time)}
        className={`
          relative p-5 rounded-xl text-lg font-semibold transition-all
          ${isUnavailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
          ${!isUnavailable && !isSelected ? 'bg-teal-50 text-teal-700 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-400 hover:shadow-md' : ''}
          ${isSelected ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-2 border-teal-600 shadow-lg scale-105' : ''}
        `}
      >
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>{time}</span>
          {isSelected && <Check className="w-5 h-5 ml-2" />}
          {isUnavailable && <X className="w-4 h-4 ml-2" />}
        </div>
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gray-400 rotate-[-15deg]"></div>
          </div>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Horários disponíveis
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Horários disponíveis
        </h3>
        {selectedDate && (
          <p className="text-lg text-teal-600 capitalize">
            {formatDate(selectedDate)}
          </p>
        )}
      </div>

      {timeSlots.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center py-12">
            <p className="text-lg text-gray-600">Nenhum horário disponível para esta data</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map(renderTimeSlot)}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border-2 border-teal-200"></div>
                <span className="text-sm text-gray-600">Disponível</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                <span className="text-sm text-gray-600">Selecionado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-400"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">Já agendado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-300 text-gray-700 px-8 py-6 text-lg"
        >
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedTime}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
