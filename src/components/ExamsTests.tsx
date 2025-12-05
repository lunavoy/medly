import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ExamsTests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const exams = [
    {
      id: 1,
      name: 'Hemograma Completo',
      type: 'Análise Clínica',
      date: '2024-09-15',
      doctor: 'Dr. Ana Santos',
      status: 'Completo',
      result: 'Normal',
      urgent: false,
      description: 'Avaliação completa dos componentes sanguíneos'
    },
    {
      id: 2,
      name: 'Eletrocardiograma (ECG)',
      type: 'Cardiológico',
      date: '2024-09-10',
      doctor: 'Dr. Carlos Lima',
      status: 'Pendente Revisão',
      result: 'Aguardando',
      urgent: true,
      description: 'Exame da atividade elétrica do coração'
    },
    {
      id: 3,
      name: 'Raio-X Tórax',
      type: 'Radiológico',
      date: '2024-09-05',
      doctor: 'Dr. Maria Oliveira',
      status: 'Completo',
      result: 'Normal',
      urgent: false,
      description: 'Imagem radiológica da região torácica'
    },
    {
      id: 4,
      name: 'Ultrassom Abdominal',
      type: 'Ultrassonografia',
      date: '2024-08-28',
      doctor: 'Dr. Pedro Costa',
      status: 'Completo',
      result: 'Normal',
      urgent: false,
      description: 'Avaliação por imagem dos órgãos abdominais'
    },
    {
      id: 5,
      name: 'Exame de Glicemia',
      type: 'Análise Clínica',
      date: '2024-08-20',
      doctor: 'Dr. Ana Santos',
      status: 'Completo',
      result: 'Alterado',
      urgent: true,
      description: 'Medição dos níveis de glicose no sangue'
    },
    {
      id: 6,
      name: 'Densitometria Óssea',
      type: 'Radiológico',
      date: '2024-08-15',
      doctor: 'Dr. Luiza Mendes',
      status: 'Agendado',
      result: 'Pendente',
      urgent: false,
      description: 'Avaliação da densidade mineral óssea'
    }
  ];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completo':
        return 'bg-green-100 text-green-700';
      case 'pendente revisão':
        return 'bg-yellow-100 text-yellow-700';
      case 'agendado':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-700';
      case 'alterado':
        return 'bg-red-100 text-red-700';
      case 'aguardando':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Exames e Testes</h1>
          <p className="text-lg text-gray-600 mt-2">Acompanhe todos os seus exames médicos</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-lg px-6 py-3">
          <Calendar className="w-5 h-5 mr-2" />
          Agendar Novo Exame
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="border-teal-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar exames ou médicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base h-12"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-12 text-base">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="completo">Completo</SelectItem>
                  <SelectItem value="pendente revisão">Pendente Revisão</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <div className="grid gap-6">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className={`border-l-4 ${
            exam.urgent ? 'border-l-red-500' : 'border-l-teal-500'
          } hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-6 h-6 text-teal-600" />
                    <CardTitle className="text-xl text-gray-900">{exam.name}</CardTitle>
                    {exam.urgent && (
                      <Badge className="bg-red-100 text-red-700">Urgente</Badge>
                    )}
                  </div>
                  <p className="text-base text-gray-600 mb-2">{exam.description}</p>
                  <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span>{exam.doctor}</span>
                    <span>{exam.type}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                    <Badge className={getResultColor(exam.result)}>
                      {exam.result}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-teal-300 text-teal-700 hover:bg-teal-50 h-12 text-base"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Detalhes
                </Button>
                {exam.status === 'Completo' && (
                  <Button 
                    variant="outline" 
                    className="flex-1 border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-12 text-base"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Resultado
                  </Button>
                )}
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-base"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Reagendar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum exame encontrado</h3>
            <p className="text-base text-gray-600">
              Tente ajustar os filtros de busca ou agende um novo exame.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-teal-700 mb-2">
              {exams.filter(e => e.status === 'Completo').length}
            </div>
            <p className="text-base text-gray-600">Exames Completos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-yellow-700 mb-2">
              {exams.filter(e => e.status === 'Pendente Revisão').length}
            </div>
            <p className="text-base text-gray-600">Pendentes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-blue-700 mb-2">
              {exams.filter(e => e.status === 'Agendado').length}
            </div>
            <p className="text-base text-gray-600">Agendados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-red-700 mb-2">
              {exams.filter(e => e.urgent).length}
            </div>
            <p className="text-base text-gray-600">Urgentes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}