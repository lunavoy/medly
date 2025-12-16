import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { AppointmentStep1 } from './appointment/AppointmentStep1';
import { AppointmentStep1_5 } from './appointment/AppointmentStep1_5';
import { AppointmentStep2 } from './appointment/AppointmentStep2';
import { AppointmentStep3 } from './appointment/AppointmentStep3';
import { AppointmentStep4 } from './appointment/AppointmentStep4';
import { AppointmentStep5 } from './appointment/AppointmentStep5';
import { AppointmentStep6 } from './appointment/AppointmentStep6';
import { toast } from 'sonner';
import { useUserProfile } from '../hooks/useSupabase';
import { supabase } from '../supabase/client';

interface AppointmentData {
  specialty: string;
  specialtyId: string | number;
  doctor: string;
  doctorId: string | number;
  date: Date | null;
  time: string;
  patientName: string;
  patientCPF: string;
  phone: string;
  reason: string;
  isReturn: boolean;
  lastVisitDate?: string;
}

interface AppointmentFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function AppointmentFlow({ isOpen, onClose, userName }: AppointmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const { profile } = useUserProfile();
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    specialty: '',
    specialtyId: '',
    doctor: '',
    doctorId: '',
    date: null,
    time: '',
    patientName: '',
    patientCPF: '',
    phone: '',
    reason: '',
    isReturn: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedStep = localStorage.getItem('appointmentStep');
      const savedData = localStorage.getItem('appointmentData');
      
      if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setAppointmentData(parsedData);
        } catch (e) {
          console.error('Error parsing saved appointment data:', e);
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setAppointmentData((prev) => ({
      ...prev,
      patientName: profile?.full_name || userName || '',
      patientCPF: profile?.cpf || prev.patientCPF || '',
    }));
  }, [profile, userName]);

  const handleNext = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    // Save progress to localStorage
    localStorage.setItem('appointmentStep', newStep.toString());
    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
  };

  const handleBack = () => {
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    // Save progress to localStorage
    localStorage.setItem('appointmentStep', newStep.toString());
    localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
  };

  const handleUpdateData = (data: Partial<AppointmentData>) => {
    const updatedData = { ...appointmentData, ...data };
    setAppointmentData(updatedData);
    // Save progress to localStorage
    localStorage.setItem('appointmentData', JSON.stringify(updatedData));
  };

  const handleAttemptClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Only show warning if not on final step and user has started filling data
    if (currentStep < 7 && (appointmentData.specialty || appointmentData.doctor || appointmentData.date || appointmentData.time)) {
      console.log('Mostrando aviso de saída - currentStep:', currentStep, 'appointmentData:', appointmentData);
      e.preventDefault();
      setShowExitWarning(true);
    } else {
      // If no data or on final step, close normally
      handleFinish();
    }
  };

  const handleConfirm = async () => {
    try {
      // Get patient ID from profile
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Get patient_id from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (!profileData) {
        toast.error('Perfil não encontrado');
        return;
      }

      // Create start_datetime and end_datetime (30-minute appointment) preserving local time
      const startDateTime = new Date(appointmentData.date!);
      const [hours, minutes] = appointmentData.time.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + 30);

      // Format without timezone shift (timestamp without time zone safe)
      const toLocalTimestamp = (d: Date) => {
        const pad = (v: number) => String(v).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };

      // Insert appointment
      const { error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: appointmentData.doctorId,
          patient_id: profileData.id,
          start_datetime: toLocalTimestamp(startDateTime),
          end_datetime: toLocalTimestamp(endDateTime),
          status: 'agendada'
        });

      if (error) {
        console.error('Erro ao salvar agendamento:', error);
        toast.error('Erro ao agendar consulta');
        return;
      }

      setCurrentStep(7);
      toast.success('Consulta agendada com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao agendar consulta');
    }
  };

  const handleFinish = () => {
    // Clear localStorage
    localStorage.removeItem('appointmentStep');
    localStorage.removeItem('appointmentData');
    
    onClose();
    setCurrentStep(1);
    setAppointmentData({
      specialty: '',
      specialtyId: '',
      doctor: '',
      doctorId: '',
      date: null,
      time: '',
      patientName: profile?.full_name || userName || '',
      patientCPF: profile?.cpf || '',
      phone: '',
      reason: '',
      isReturn: false,
    });
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    setCurrentStep(1);
    // Clear localStorage
    localStorage.removeItem('appointmentStep');
    localStorage.removeItem('appointmentData');
""    // Close the modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Agendamento Modal - Hidden when exit warning is shown */}
      {!showExitWarning && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4 animate-fade-in"
        onClick={(e) => {
          // Close modal when clicking outside
          if (e.target === e.currentTarget) {
            handleAttemptClose(e);
          }
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-xl flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Agendar Consulta</h2>
              <p className="text-teal-100 mt-1">
                {currentStep === 1 && 'Escolha a especialidade'}
                {currentStep === 2 && 'Selecione o médico'}
                {currentStep === 3 && 'Selecione a data'}
                {currentStep === 4 && 'Escolha o horário'}
                {currentStep === 5 && 'Informe os detalhes'}
                {currentStep === 6 && 'Confirme os dados'}
                {currentStep === 7 && 'Consulta confirmada'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleAttemptClose(e)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

        {/* Progress Bar */}
        {currentStep < 7 && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step <= currentStep
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 6 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        step < currentStep ? 'bg-teal-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <AppointmentStep1
              selectedSpecialty={appointmentData.specialty}
              onSelect={(specialty, specialtyId) => handleUpdateData({ specialty, specialtyId })}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <AppointmentStep1_5
              selectedSpecialtyId={appointmentData.specialtyId}
              selectedDoctor={appointmentData.doctor}
              onSelect={(doctor, doctorId) => handleUpdateData({ doctor, doctorId })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <AppointmentStep2
              selectedDoctor={appointmentData.doctor}
              selectedDoctorId={appointmentData.doctorId}
              selectedDate={appointmentData.date}
              onSelect={(date) => handleUpdateData({ date })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <AppointmentStep3
              selectedDoctor={appointmentData.doctor}
              selectedDoctorId={appointmentData.doctorId}
              selectedDate={appointmentData.date}
              selectedTime={appointmentData.time}
              onSelect={(time) => handleUpdateData({ time })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <AppointmentStep4
              data={appointmentData}
              onUpdate={handleUpdateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 6 && (
            <AppointmentStep5
              data={appointmentData}
              onConfirm={handleConfirm}
              onBack={() => setCurrentStep(4)}
            />
          )}
          {currentStep === 7 && (
            <AppointmentStep6
              data={appointmentData}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>
    </div>
      )}

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl border-0">
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Confirmar Saída</h3>
                <p className="text-base text-gray-600 mt-3">
                  Você ainda não agendou sua consula. Deseja realmente sair?
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowExitWarning(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2"
                >
                  Não
                </Button>
                <Button
                  onClick={handleConfirmExit}
                  style={{ backgroundColor: '#dc2626', color: 'white' }}
                  className="flex-1 hover:bg-red-700 font-semibold py-2"
                >
                  Sim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}