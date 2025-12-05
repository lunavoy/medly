import React from 'react';
import { Heart, Stethoscope, Apple, Activity, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface AppointmentStep1Props {
  selectedSpecialty: string;
  onSelect: (specialty: string) => void;
  onNext: () => void;
}

const specialties = [
  {
    id: 'cardiologia',
    name: 'Cardiologia',
    icon: Heart,
    description: 'Cuidados com o coração',
    doctor: 'Dr. Paulo Juvenal Alves'
  },
  {
    id: 'clinico-geral',
    name: 'Clínico Geral',
    icon: Stethoscope,
    description: 'Consultas e check-ups gerais',
    doctor: 'Vários profissionais'
  },
  {
    id: 'nutrologia',
    name: 'Nutrologia',
    icon: Apple,
    description: 'Orientação nutricional',
    doctor: 'Vários profissionais'
  },
  {
    id: 'exames',
    name: 'Exames',
    icon: Activity,
    description: 'Ecocardiograma, Holter, MAPA',
    doctor: 'Diversos exames disponíveis'
  }
];

export function AppointmentStep1({ selectedSpecialty, onSelect, onNext }: AppointmentStep1Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Marcar nova consulta
        </h3>
        <p className="text-lg text-gray-600">
          Escolha a especialidade desejada
        </p>
      </div>

      <div className="grid gap-4">
        {specialties.map((specialty) => {
          const Icon = specialty.icon;
          const isSelected = selectedSpecialty === specialty.name;
          
          return (
            <Card
              key={specialty.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-2 border-teal-500 bg-teal-50'
                  : 'border-2 border-gray-200 hover:border-teal-300'
              }`}
              onClick={() => onSelect(specialty.name)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                          : 'bg-gradient-to-r from-teal-100 to-cyan-100'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          isSelected ? 'text-white' : 'text-teal-600'
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {specialty.name}
                      </h4>
                      <p className="text-base text-gray-600 mt-1">
                        {specialty.description}
                      </p>
                      <p className="text-sm text-teal-600 mt-1">
                        {specialty.doctor}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
