import React, { useEffect, useState } from 'react';
import { User, Frown } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../supabase/client';

interface AppointmentStep1_5Props {
  selectedSpecialtyId: string | number;
  selectedDoctor: string;
  onSelect: (doctor: string, doctorId: string | number) => void;
  onNext: () => void;
  onBack: () => void;
}

type Doctor = { 
  id: string | number; 
  full_name: string; 
  specialty_id: string | number;
  gender: 'M' | 'F';
  crm_number: string;
  crm_state: string;
};

export function AppointmentStep1_5({
  selectedSpecialtyId,
  selectedDoctor,
  onSelect,
  onNext,
  onBack,
}: AppointmentStep1_5Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      console.log('Fetching doctors for specialtyId:', selectedSpecialtyId, 'Type:', typeof selectedSpecialtyId);
      
      // Fetch doctors filtered by specialty_id directly
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialty_id, gender, crm_number, crm_state')
        .eq('specialty_id', String(selectedSpecialtyId));

      console.log('Query error:', error);
      console.log('Doctors data:', data);
      console.log('Total doctors found:', data?.length || 0);
      
      if (!error && data) {
        const keyFor = (doc: Doctor) => `${String(doc.id)}|${doc.full_name?.toLowerCase?.() || ''}`;
        const deduped = Array.from(new Map((data as Doctor[]).map((doc) => [keyFor(doc), doc])).values());
        setDoctors(deduped);
      }
      setLoading(false);
    };

    if (selectedSpecialtyId) fetchDoctors();
  }, [selectedSpecialtyId]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Selecione o médico</h3>
        <p className="text-lg text-gray-600">Especialidade selecionada</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        ) : doctors.length === 0 ? (
          <div className="text-center py-8">
            <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Nenhum médico desta especialidade disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {doctors.map((doc) => {
              const isSelected = selectedDoctor === doc.full_name;
              const prefix = doc.gender === 'M' ? 'Dr.' : 'Dra.';
              return (
                <button
                  key={doc.id}
                  onClick={() => onSelect(doc.full_name, doc.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-teal-500' : 'bg-gray-200'
                    }`}
                  >
                    <User className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="text-left">
                    <span className="text-gray-900 font-medium">{prefix} {doc.full_name}</span>
                    <p className="text-sm text-gray-600 mt-1">
                      CRM {doc.crm_number} - {doc.crm_state}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-gray-300 text-gray-700 px-8 py-6 text-lg"
        >
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDoctor || doctors.length === 0}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
