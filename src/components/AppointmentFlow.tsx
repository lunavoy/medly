import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { AppointmentStep1 } from './appointment/AppointmentStep1';
import { AppointmentStep2 } from './appointment/AppointmentStep2';
import { AppointmentStep3 } from './appointment/AppointmentStep3';
import { AppointmentStep4 } from './appointment/AppointmentStep4';
import { AppointmentStep5 } from './appointment/AppointmentStep5';
import { AppointmentStep6 } from './appointment/AppointmentStep6';
import { toast } from 'sonner@2.0.3';

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

interface AppointmentFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function AppointmentFlow({ isOpen, onClose, userName }: AppointmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    specialty: 'Cardiologia',
    date: null,
    time: '',
    patientName: userName,
    patientCPF: '123.456.789-00', // Mock CPF
    phone: '(11) 98765-4321', // Mock phone
    reason: '',
    isReturn: false,
  });

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleUpdateData = (data: Partial<AppointmentData>) => {
    setAppointmentData({ ...appointmentData, ...data });
  };

  const handleConfirm = () => {
    setCurrentStep(6);
    toast.success('Consulta agendada com sucesso!');
  };

  const handleFinish = () => {
    onClose();
    setCurrentStep(1);
    setAppointmentData({
      specialty: 'Cardiologia',
      date: null,
      time: '',
      patientName: userName,
      patientCPF: '123.456.789-00',
      phone: '(11) 98765-4321',
      reason: '',
      isReturn: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
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
              {currentStep === 2 && 'Selecione a data'}
              {currentStep === 3 && 'Escolha o horário'}
              {currentStep === 4 && 'Informe os detalhes'}
              {currentStep === 5 && 'Confirme os dados'}
              {currentStep === 6 && 'Consulta confirmada'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Bar */}
        {currentStep < 6 && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
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
                  {step < 5 && (
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
              onSelect={(specialty) => handleUpdateData({ specialty })}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <AppointmentStep2
              selectedDate={appointmentData.date}
              onSelect={(date) => handleUpdateData({ date })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <AppointmentStep3
              selectedDate={appointmentData.date}
              selectedTime={appointmentData.time}
              onSelect={(time) => handleUpdateData({ time })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <AppointmentStep4
              data={appointmentData}
              onUpdate={handleUpdateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 5 && (
            <AppointmentStep5
              data={appointmentData}
              onConfirm={handleConfirm}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 6 && (
            <AppointmentStep6
              data={appointmentData}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>
    </div>
  );
}