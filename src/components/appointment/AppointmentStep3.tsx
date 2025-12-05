import React from 'react';
import { Clock, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface AppointmentStep3Props {
  selectedDate: Date | null;
  selectedTime: string;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AppointmentStep3({ selectedDate, selectedTime, onSelect, onNext, onBack }: AppointmentStep3Props) {
  // Generate time slots
  const morningSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  
  // Mock unavailable slots (already booked)
  const unavailableSlots = ['09:00', '10:30', '15:00', '16:30'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
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

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Morning Slots */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              Manhã
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {morningSlots.map(renderTimeSlot)}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
              Tarde
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {afternoonSlots.map(renderTimeSlot)}
            </div>
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
