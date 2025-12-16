import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { supabase } from '../../supabase/client';

interface AppointmentStep1Props {
  selectedSpecialty: string;
  onSelect: (specialty: string, specialtyId: string | number) => void;
  onNext: () => void;
}

type Specialty = { id: string | number; specialty: string };

export function AppointmentStep1({ selectedSpecialty, onSelect, onNext }: AppointmentStep1Props) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      const { data, error } = await supabase.from('specialties').select('id, specialty');
      if (error) {
        console.error('Error fetching specialties:', error);
      }
      if (!error && data) {
        console.log('Fetched specialties:', data);
        setSpecialties(data as Specialty[]);
      }
      setLoading(false);
    };

    fetchSpecialties();
  }, []);

  const filtered = specialties.filter((s) =>
    s.specialty.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Marcar nova consulta</h3>
        <p className="text-lg text-gray-600">Escolha a especialidade desejada</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar especialidades"
          className="w-full border-2 border-teal-200 focus:border-teal-500 rounded-lg p-3"
        />

        {loading ? (
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filtered.map((s) => {
              const isSelected = selectedSpecialty === s.specialty;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelect(s.specialty, s.id)}
                  className={`text-left p-3 rounded-lg border-2 transition-colors ${
                    isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{s.specialty}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!selectedSpecialty}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
