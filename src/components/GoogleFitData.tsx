import React, { useState, useEffect } from 'react';
import { Heart, Activity, Footprints, Zap, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function GoogleFitData() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  // Mock data - in a real app, this would come from Google Fit API
  const dailyData = [
    { date: '01/10', steps: 8542, heartRate: 72, calories: 2240, distance: 6.8 },
    { date: '02/10', steps: 9234, heartRate: 75, calories: 2380, distance: 7.2 },
    { date: '03/10', steps: 7865, heartRate: 68, calories: 2150, distance: 6.1 },
    { date: '04/10', steps: 10123, heartRate: 78, calories: 2450, distance: 8.1 },
    { date: '05/10', steps: 8976, heartRate: 73, calories: 2320, distance: 7.0 },
    { date: '06/10', steps: 9567, heartRate: 71, calories: 2410, distance: 7.5 },
    { date: '07/10', steps: 8234, heartRate: 69, calories: 2180, distance: 6.4 }
  ];

  const healthMetrics = {
    steps: { value: 8234, goal: 10000, trend: 'down', percentage: 82.3 },
    heartRate: { value: 69, status: 'normal', trend: 'stable' },
    calories: { value: 2180, goal: 2500, trend: 'up', percentage: 87.2 },
    distance: { value: 6.4, goal: 8.0, trend: 'down', percentage: 80.0 },
    activeMinutes: { value: 45, goal: 60, trend: 'up', percentage: 75.0 },
    sleep: { value: 7.2, goal: 8.0, trend: 'stable', percentage: 90.0 }
  };

  const connectGoogleFit = () => {
    // In a real app, this would trigger Google Fit OAuth
    setIsConnected(true);
    setLastSync(new Date());
  };

  const syncData = () => {
    // In a real app, this would fetch latest data from Google Fit
    setLastSync(new Date());
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dados de Saúde</h1>
          <p className="text-lg text-gray-600 mt-2">Conecte com o Google Fit para monitorar sua saúde</p>
        </div>

        <Card className="border-teal-100">
          <CardContent className="pt-12 pb-12 text-center">
            <Activity className="w-20 h-20 text-teal-600 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Conectar Google Fit</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Sincronize seus dados de atividade física, frequência cardíaca e sono 
              para ter uma visão completa da sua saúde.
            </p>
            <Button 
              onClick={connectGoogleFit}
              className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-4"
            >
              <Heart className="w-5 h-5 mr-2" />
              Conectar com Google Fit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dados de Saúde</h1>
          <p className="text-lg text-gray-600 mt-2">
            Última sincronização: {lastSync.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={syncData}
            variant="outline" 
            className="border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            <Activity className="w-4 h-4 mr-2" />
            Sincronizar
          </Button>
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            Conectado ao Google Fit
          </Badge>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Steps */}
        <Card className="border-teal-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <Footprints className="w-5 h-5 mr-2 text-teal-600" />
                Passos
              </div>
              {getTrendIcon(healthMetrics.steps.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold text-teal-700">
                  {healthMetrics.steps.value.toLocaleString()}
                </span>
                <span className="text-base text-gray-600">
                  / {healthMetrics.steps.goal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${getProgressColor(healthMetrics.steps.percentage)}`}
                  style={{ width: `${healthMetrics.steps.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{healthMetrics.steps.percentage}% da meta diária</p>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card className="border-cyan-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-cyan-600" />
                Frequência Cardíaca
              </div>
              {getTrendIcon(healthMetrics.heartRate.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold text-cyan-700">
                  {healthMetrics.heartRate.value}
                </span>
                <span className="text-base text-gray-600">bpm</span>
              </div>
              <Badge className="bg-green-100 text-green-700">
                {healthMetrics.heartRate.status === 'normal' ? 'Normal' : 'Atenção'}
              </Badge>
              <p className="text-sm text-gray-600">Frequência cardíaca em repouso</p>
            </div>
          </CardContent>
        </Card>

        {/* Calories */}
        <Card className="border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Calorias
              </div>
              {getTrendIcon(healthMetrics.calories.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold text-blue-700">
                  {healthMetrics.calories.value}
                </span>
                <span className="text-base text-gray-600">
                  / {healthMetrics.calories.goal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${getProgressColor(healthMetrics.calories.percentage)}`}
                  style={{ width: `${healthMetrics.calories.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{healthMetrics.calories.percentage}% da meta diária</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Chart */}
        <Card className="border-teal-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Footprints className="w-6 h-6 mr-3 text-teal-600" />
              Passos - Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heart Rate Chart */}
        <Card className="border-cyan-100">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-cyan-600" />
              Frequência Cardíaca - Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#0891b2" 
                  strokeWidth={3}
                  dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distance */}
        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Distância
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-green-700">
                  {healthMetrics.distance.value}
                </span>
                <span className="text-base text-gray-600">km</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${healthMetrics.distance.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Meta: {healthMetrics.distance.goal} km</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Minutes */}
        <Card className="border-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Minutos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-orange-700">
                  {healthMetrics.activeMinutes.value}
                </span>
                <span className="text-base text-gray-600">min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-orange-500"
                  style={{ width: `${healthMetrics.activeMinutes.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Meta: {healthMetrics.activeMinutes.goal} min</p>
            </div>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card className="border-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Sono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-purple-700">
                  {healthMetrics.sleep.value}
                </span>
                <span className="text-base text-gray-600">horas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${healthMetrics.sleep.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">Meta: {healthMetrics.sleep.goal} horas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Insights de Saúde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium text-green-900">Boa atividade física!</p>
                <p className="text-sm text-green-700">
                  Você manteve uma boa consistência nos exercícios esta semana.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <Heart className="w-5 h-5 text-yellow-600 mt-1" />
              <div>
                <p className="font-medium text-yellow-900">Frequência cardíaca estável</p>
                <p className="text-sm text-yellow-700">
                  Sua frequência cardíaca em repouso está dentro dos parâmetros normais.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-blue-900">Meta de calorias quase alcançada</p>
                <p className="text-sm text-blue-700">
                  Você está a apenas 320 calorias da sua meta diária!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}