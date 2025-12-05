import React from 'react';
import { User, Phone, FileText, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

interface AppointmentData {
  patientName: string;
  patientCPF: string;
  phone: string;
  reason: string;
  isReturn: boolean;
  lastVisitDate?: string;
}

interface AppointmentStep4Props {
  data: AppointmentData;
  onUpdate: (data: Partial<AppointmentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AppointmentStep4({ data, onUpdate, onNext, onBack }: AppointmentStep4Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.reason.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Informações da consulta
        </h3>
        <p className="text-lg text-gray-600">
          Confirme seus dados e o motivo da consulta
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <Label htmlFor="patientName" className="text-lg flex items-center space-x-2">
                <User className="w-5 h-5 text-teal-600" />
                <span>Nome completo</span>
              </Label>
              <Input
                id="patientName"
                value={data.patientName}
                disabled
                className="bg-gray-50 text-lg p-6 border-2"
              />
              <p className="text-sm text-gray-500">
                Nome cadastrado no sistema
              </p>
            </div>

            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="patientCPF" className="text-lg flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>CPF</span>
              </Label>
              <Input
                id="patientCPF"
                value={data.patientCPF}
                disabled
                className="bg-gray-50 text-lg p-6 border-2"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg flex items-center space-x-2">
                <Phone className="w-5 h-5 text-teal-600" />
                <span>Telefone para contato</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                className="text-lg p-6 border-2 border-teal-200 focus:border-teal-500"
                placeholder="(11) 98765-4321"
              />
              <p className="text-sm text-gray-500">
                Número para contato e confirmação
              </p>
            </div>

            {/* Return Visit Toggle */}
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-teal-600" />
                <div>
                  <Label htmlFor="isReturn" className="text-lg cursor-pointer">
                    É uma consulta de retorno?
                  </Label>
                  <p className="text-sm text-gray-600">
                    Marque se já consultou antes
                  </p>
                </div>
              </div>
              <Switch
                id="isReturn"
                checked={data.isReturn}
                onCheckedChange={(checked) => onUpdate({ isReturn: checked })}
                className="data-[state=checked]:bg-teal-600"
              />
            </div>

            {/* Last Visit Date (if return) */}
            {data.isReturn && (
              <div className="space-y-2 pl-4 border-l-4 border-teal-300">
                <Label htmlFor="lastVisitDate" className="text-lg">
                  Data da última consulta
                </Label>
                <Input
                  id="lastVisitDate"
                  type="date"
                  value={data.lastVisitDate || ''}
                  onChange={(e) => onUpdate({ lastVisitDate: e.target.value })}
                  className="text-lg p-6 border-2 border-teal-200 focus:border-teal-500"
                />
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-lg flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Motivo da consulta *</span>
              </Label>
              <Textarea
                id="reason"
                value={data.reason}
                onChange={(e) => onUpdate({ reason: e.target.value })}
                className="text-lg p-4 border-2 border-teal-200 focus:border-teal-500 min-h-32"
                placeholder="Ex: dor torácica, retorno de exame, check-up preventivo..."
                required
              />
              <p className="text-sm text-gray-500">
                Descreva brevemente o motivo da sua consulta
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300 text-gray-700 px-8 py-6 text-lg"
          >
            Voltar
          </Button>
          <Button
            type="submit"
            disabled={!data.reason.trim()}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
