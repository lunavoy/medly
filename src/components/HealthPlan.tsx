import React from 'react';
import { Shield, FileText, Phone, MapPin, Clock, Star, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface User {
  name: string;
  age: number;
  healthPlan: string;
  memberSince: string;
}

interface HealthPlanProps {
  user: User;
}

export function HealthPlan({ user }: HealthPlanProps) {
  const planDetails = {
    name: 'Premium Care Plus',
    type: 'Plano Família',
    memberNumber: 'PC-2024-789456',
    validUntil: '2025-03-15',
    status: 'Ativo',
    monthlyFee: 'R$ 850,00',
    coparticipation: 'R$ 25,00',
    coverage: 'Nacional',
    emergencyPhone: '0800-123-4567'
  };

  const coverageDetails = {
    consultations: {
      title: 'Consultas Médicas',
      unlimited: true,
      coparticipation: 'R$ 25,00',
      description: 'Consultas com clínicos gerais e especialistas'
    },
    exams: {
      title: 'Exames Laboratoriais',
      unlimited: true,
      coparticipation: 'Isento',
      description: 'Exames de sangue, urina e outros laboratoriais'
    },
    imaging: {
      title: 'Exames de Imagem',
      unlimited: false,
      limit: '12 por ano',
      coparticipation: 'R$ 50,00',
      description: 'Raio-X, ultrassom, tomografia, ressonância'
    },
    hospitalization: {
      title: 'Internação Hospitalar',
      unlimited: true,
      coparticipation: 'Isento',
      description: 'Internação em quarto privativo'
    },
    emergency: {
      title: 'Pronto Socorro',
      unlimited: true,
      coparticipation: 'R$ 75,00',
      description: 'Atendimento de urgência e emergência'
    },
    medicines: {
      title: 'Medicamentos',
      unlimited: false,
      limit: '80% desconto',
      coparticipation: 'Variável',
      description: 'Desconto em medicamentos na rede credenciada'
    }
  };

  const networkHospitals = [
    {
      name: 'Hospital Sírio-Libanês',
      location: 'Bela Vista, São Paulo',
      rating: 4.9,
      specialties: ['Cardiologia', 'Oncologia', 'Neurologia'],
      emergency: true
    },
    {
      name: 'Hospital Israelita Albert Einstein',
      location: 'Morumbi, São Paulo',
      rating: 4.8,
      specialties: ['Cirurgia', 'Diagnóstico por Imagem', 'Medicina Preventiva'],
      emergency: true
    },
    {
      name: 'Hospital das Clínicas',
      location: 'Cerqueira César, São Paulo',
      rating: 4.7,
      specialties: ['Todas as especialidades'],
      emergency: true
    }
  ];

  const recentUsage = [
    {
      date: '2024-09-15',
      service: 'Consulta Cardiológica',
      provider: 'Dr. Ana Santos',
      cost: 'R$ 250,00',
      coparticipation: 'R$ 25,00',
      status: 'Aprovado'
    },
    {
      date: '2024-09-10',
      service: 'Eletrocardiograma',
      provider: 'Clínica Cardio Care',
      cost: 'R$ 120,00',
      coparticipation: 'Isento',
      status: 'Aprovado'
    },
    {
      date: '2024-08-28',
      service: 'Hemograma Completo',
      provider: 'Laboratório Central',
      cost: 'R$ 85,00',
      coparticipation: 'Isento',
      status: 'Aprovado'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Plano de Saúde</h1>
          <p className="text-lg text-gray-600 mt-2">Informações do seu plano e cobertura</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FileText className="w-4 h-4 mr-2" />
            Carteirinha Digital
          </Button>
          <Button variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-50">
            <Phone className="w-4 h-4 mr-2" />
            Contatar Plano
          </Button>
        </div>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Details */}
        <Card className="border-teal-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-teal-600" />
              Detalhes do Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plano</p>
                <p className="font-medium text-gray-900">{planDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tipo</p>
                <p className="font-medium text-gray-900">{planDetails.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Número</p>
                <p className="font-medium text-gray-900">{planDetails.memberNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {planDetails.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Válido até</p>
                <p className="font-medium text-gray-900">
                  {new Date(planDetails.validUntil).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Cobertura</p>
                <p className="font-medium text-gray-900">{planDetails.coverage}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base text-gray-600">Mensalidade</span>
                <span className="text-xl font-semibold text-teal-700">{planDetails.monthlyFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-600">Coparticipação padrão</span>
                <span className="font-medium text-gray-900">{planDetails.coparticipation}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Phone className="w-6 h-6 mr-3 text-red-600" />
              Contatos de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">Central de Atendimento 24h</h3>
              <p className="text-2xl font-semibold text-red-700 mb-2">{planDetails.emergencyPhone}</p>
              <p className="text-sm text-red-600">
                Disponível 24 horas para emergências e autorizações urgentes
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">Autorização de Exames</p>
                  <p className="text-sm text-gray-600">(11) 3456-7890</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">Rede Credenciada</p>
                  <p className="text-sm text-gray-600">(11) 3456-7891</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">2ª Via de Documentos</p>
                  <p className="text-sm text-gray-600">(11) 3456-7892</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Details */}
      <Card className="border-cyan-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Cobertura do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(coverageDetails).map(([key, coverage]) => (
              <div key={key} className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{coverage.title}</h3>
                  {coverage.unlimited ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                      {coverage.limit}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{coverage.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Coparticipação:</span>
                  <span className="font-medium text-cyan-700">{coverage.coparticipation}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Hospitals */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Hospitais da Rede</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkHospitals.map((hospital, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{hospital.name}</h3>
                    {hospital.emergency && (
                      <Badge className="bg-red-100 text-red-700">
                        Pronto Socorro
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hospital.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {hospital.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Especialidades: {hospital.specialties.join(', ')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Como Chegar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Usage */}
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Utilização Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsage.map((usage, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-gray-900">{usage.service}</h3>
                    <Badge className={`${
                      usage.status === 'Aprovado' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {usage.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{usage.provider}</span>
                    <span>{new Date(usage.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Custo: {usage.cost}</p>
                  <p className="font-medium text-teal-700">
                    Sua parte: {usage.coparticipation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-16 bg-teal-600 hover:bg-teal-700 flex flex-col items-center justify-center space-y-1">
          <FileText className="w-5 h-5" />
          <span>Extrato de Uso</span>
        </Button>
        <Button className="h-16 bg-cyan-600 hover:bg-cyan-700 flex flex-col items-center justify-center space-y-1">
          <MapPin className="w-5 h-5" />
          <span>Rede Credenciada</span>
        </Button>
        <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center space-y-1">
          <Phone className="w-5 h-5" />
          <span>Autorização</span>
        </Button>
        <Button className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center space-y-1">
          <Shield className="w-5 h-5" />
          <span>Reembolso</span>
        </Button>
      </div>
    </div>
  );
}