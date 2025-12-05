import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface AppointmentStep2Props {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AppointmentStep2({ selectedDate, onSelect, onNext, onBack }: AppointmentStep2Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = generateCalendarDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 45); // Next 45 days

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    // Only available for next 45 days and not on weekends
    const dayOfWeek = date.getDay();
    return dateOnly >= today && dateOnly <= maxDate && dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly.getTime() === today.getTime();
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Selecione a data da consulta
        </h3>
        <p className="text-lg text-gray-600">
          Disponível para os próximos 45 dias
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="text-teal-600 border-teal-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h4 className="text-xl font-semibold text-gray-900 capitalize">
              {monthName}
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="text-teal-600 border-teal-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const available = isDateAvailable(date);
              const selected = isDateSelected(date);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={index}
                  disabled={!date || !available}
                  onClick={() => date && available && onSelect(date)}
                  className={`
                    aspect-square p-2 rounded-lg text-base font-medium transition-all
                    ${!date ? 'invisible' : ''}
                    ${!available && date ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : ''}
                    ${available && !selected ? 'text-gray-900 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-400' : ''}
                    ${selected ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-2 border-teal-600 shadow-lg scale-105' : ''}
                    ${isTodayDate && !selected ? 'border-2 border-blue-500' : ''}
                  `}
                >
                  {date?.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-teal-50 border-2 border-teal-200"></div>
              <span className="text-sm text-gray-600">Disponível</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gradient-to-r from-teal-500 to-cyan-500"></div>
              <span className="text-sm text-gray-600">Selecionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gray-50 border-2 border-gray-200"></div>
              <span className="text-sm text-gray-600">Indisponível</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded border-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">Hoje</span>
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
          disabled={!selectedDate}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
