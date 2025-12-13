import React, { useEffect } from 'react';
import { Heart, Calendar, FileText, TrendingUp, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  name: string;
  age: number;
  healthPlan: string;
  memberSince: string;
}

interface DashboardOverviewProps {
  user: User;
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const navigate = useNavigate();
  const upcomingAppointments = [
    {
      doctor: 'Dr. Ana Santos',
      specialty: 'Cardiologia',
      date: 'Hoje, 14:30',
      type: 'Consulta de rotina'
    },
    {
      doctor: 'Dr. João Silva',
      specialty: 'Oftalmologia',
      date: 'Amanhã, 10:00',
      type: 'Exame de vista'
    }
  ];

  const healthMetrics = [
    {
      label: 'Pressão Arterial',
      value: '120/80',
      status: 'normal',
      icon: Heart,
      trend: 'stable'
    },
    {
      label: 'Frequência Cardíaca',
      value: '72 bpm',
      status: 'normal',
      icon: Heart,
      trend: 'down'
    },
    {
      label: 'Glicose',
      value: '95 mg/dL',
      status: 'normal',
      icon: TrendingUp,
      trend: 'stable'
    },
    {
      label: 'Peso',
      value: '68 kg',
      status: 'normal',
      icon: TrendingUp,
      trend: 'down'
    }
  ];

  const recentExams = [
    {
      name: 'Hemograma Completo',
      date: '15/09/2024',
      status: 'Resultados Normais',
      urgent: false
    },
    {
      name: 'Eletrocardiograma',
      date: '10/09/2024',
      status: 'Pendente Revisão',
      urgent: true
    },
    {
      name: 'Raio-X Tórax',
      date: '05/09/2024',
      status: 'Resultados Normais',
      urgent: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-teal-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-gray-900">Bem-vinda, {user.name}!</CardTitle>
            <p className="text-lg text-gray-600">Como está se sentindo hoje?</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZG9jdG9yJTIwY29uc3VsdGF0aW9uJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTk4Nzg5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Healthcare consultation"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">{user.age} anos</p>
                <p className="text-base text-gray-600">Membro desde {user.memberSince}</p>
                <Badge className="mt-2 bg-teal-100 text-teal-700 hover:bg-teal-200">
                  <Shield className="w-4 h-4 mr-1" />
                  {user.healthPlan}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-cyan-600" />
              Próximas Consultas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appointment.doctor}</p>
                  <p className="text-base text-gray-600">{appointment.specialty}</p>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-cyan-700">{appointment.date}</p>
                  <Button size="sm" className="mt-2 bg-cyan-600 hover:bg-cyan-700">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics */}
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-teal-600" />
            Seus Dados de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-8 h-8 text-teal-600" />
                    <Badge 
                      className={`${
                        metric.status === 'normal' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {metric.status === 'normal' ? 'Normal' : 'Atenção'}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{metric.label}</h3>
                  <p className="text-2xl font-semibold text-teal-700">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Exams */}
      <Card className="border-cyan-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-cyan-600" />
            Exames Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    exam.urgent ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{exam.name}</p>
                    <p className="text-base text-gray-600">{exam.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${
                    exam.urgent 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {exam.status}
                  </Badge>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-50">
                      Ver Resultado
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button className="h-20 text-lg bg-teal-600 hover:bg-teal-700 flex items-center justify-center space-x-3">
          <Calendar className="w-6 h-6" />
          <span>Agendar Consulta</span>
        </Button>
        <Button className="h-20 text-lg bg-cyan-600 hover:bg-cyan-700 flex items-center justify-center space-x-3">
          <FileText className="w-6 h-6" />
          <span>Ver Exames</span>
        </Button>
        <Button className="h-20 text-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-3">
          <Heart className="w-6 h-6" />
          <span>Dados de Saúde</span>
        </Button>
      </div>
    </div>
  );
}