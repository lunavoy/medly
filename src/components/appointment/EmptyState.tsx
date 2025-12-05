import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface EmptyStateProps {
  type: 'no-slots' | 'error';
  onRetry?: () => void;
}

export function EmptyState({ type, onRetry }: EmptyStateProps) {
  if (type === 'no-slots') {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-amber-600" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Não há horários disponíveis neste dia
              </h4>
              <p className="text-base text-gray-600">
                Por favor, escolha outra data para agendar sua consulta
              </p>
            </div>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              >
                Escolher outro dia
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-red-200 bg-red-50">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar informações
            </h4>
            <p className="text-base text-gray-600">
              Não foi possível carregar os dados. Por favor, tente novamente.
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Tentar novamente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
