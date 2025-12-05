import React, { useState } from 'react';
import { Users, Phone, MapPin, Star, Calendar, Search, Filter, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function DoctorsDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Ana Santos',
      specialty: 'Cardiologia',
      experience: '15 anos',
      rating: 4.9,
      reviews: 127,
      phone: '(11) 99999-1234',
      location: 'Hospital São Paulo - Zona Sul',
      availability: 'Disponível hoje',
      consultationFee: 'R$ 250',
      languages: ['Português', 'Inglês'],
      acceptsInsurance: true,
      nextAppointment: '2024-10-08 14:30',
      image: 'https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZG9jdG9yJTIwY29uc3VsdGF0aW9uJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTk4Nzg5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'Dr. Carlos Lima',
      specialty: 'Cardiologia',
      experience: '20 anos',
      rating: 4.8,
      reviews: 89,
      phone: '(11) 99999-5678',
      location: 'Clínica Cardio Care - Centro',
      availability: 'Próxima vaga: Amanhã',
      consultationFee: 'R$ 300',
      languages: ['Português'],
      acceptsInsurance: true,
      nextAppointment: '2024-10-09 10:00',
      image: 'https://images.unsplash.com/photo-1659019479972-82d9e3e8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZWRpY2FsJTIwc3RldGhvc2NvcGUlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc1OTg2MDI4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Dr. Maria Oliveira',
      specialty: 'Radiologia',
      experience: '12 anos',
      rating: 4.7,
      reviews: 156,
      phone: '(11) 99999-9012',
      location: 'Centro de Diagnóstico - Vila Madalena',
      availability: 'Disponível esta semana',
      consultationFee: 'R$ 200',
      languages: ['Português', 'Espanhol'],
      acceptsInsurance: true,
      nextAppointment: '2024-10-10 16:00',
      image: 'https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZG9jdG9yJTIwY29uc3VsdGF0aW9uJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTk4Nzg5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      name: 'Dr. João Silva',
      specialty: 'Oftalmologia',
      experience: '18 anos',
      rating: 4.9,
      reviews: 203,
      phone: '(11) 99999-3456',
      location: 'Instituto de Olhos - Moema',
      availability: 'Disponível hoje',
      consultationFee: 'R$ 280',
      languages: ['Português', 'Inglês', 'Francês'],
      acceptsInsurance: true,
      nextAppointment: '2024-10-08 11:00',
      image: 'https://images.unsplash.com/photo-1659019479972-82d9e3e8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZWRpY2FsJTIwc3RldGhvc2NvcGUlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc1OTg2MDI4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      name: 'Dr. Pedro Costa',
      specialty: 'Gastroenterologia',
      experience: '14 anos',
      rating: 4.6,
      reviews: 95,
      phone: '(11) 99999-7890',
      location: 'Hospital Sírio-Libanês - Bela Vista',
      availability: 'Próxima vaga: Quinta-feira',
      consultationFee: 'R$ 320',
      languages: ['Português', 'Inglês'],
      acceptsInsurance: true,
      nextAppointment: '2024-10-11 14:00',
      image: 'https://images.unsplash.com/photo-1758691462321-9b6c98c40f7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZG9jdG9yJTIwY29uc3VsdGF0aW9uJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTk4Nzg5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      name: 'Dr. Luiza Mendes',
      specialty: 'Ortopedia',
      experience: '16 anos',
      rating: 4.8,
      reviews: 142,
      phone: '(11) 99999-2468',
      location: 'Clínica Ortopédica - Itaim Bibi',
      availability: 'Disponível amanhã',
      consultationFee: 'R$ 270',
      languages: ['Português'],
      acceptsInsurance: true,
      nextAppointment: '2024-10-09 15:30',
      image: 'https://images.unsplash.com/photo-1659019479972-82d9e3e8cfb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZWRpY2FsJTIwc3RldGhvc2NvcGUlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc1OTg2MDI4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const specialties = [...new Set(doctors.map(doc => doc.specialty))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('hoje')) return 'bg-green-100 text-green-700';
    if (availability.includes('amanhã')) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Diretório de Médicos</h1>
          <p className="text-lg text-gray-600 mt-2">Encontre o especialista ideal para você</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-lg px-6 py-3">
          <Users className="w-5 h-5 mr-2" />
          Buscar Especialista
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
                  placeholder="Buscar médicos ou especialidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base h-12"
                />
              </div>
            </div>
            <div className="md:w-64">
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="h-12 text-base">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Especialidades</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="border-teal-100 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-teal-100"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-1">{doctor.name}</CardTitle>
                    <div className="flex flex-wrap items-center space-x-4 text-base text-gray-600">
                      <span className="font-medium text-teal-700">{doctor.specialty}</span>
                      <span>{doctor.experience} de experiência</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{doctor.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({doctor.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-base text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-teal-600" />
                        {doctor.phone}
                      </div>
                      <div className="flex items-center text-base text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-teal-600" />
                        {doctor.location}
                      </div>
                      <div className="flex items-center text-base text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-teal-600" />
                        Próxima consulta: {new Date(doctor.nextAppointment).toLocaleDateString('pt-BR')} às {new Date(doctor.nextAppointment).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-base text-gray-600">Valor da consulta:</span>
                        <span className="font-medium text-teal-700">{doctor.consultationFee}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base text-gray-600">Idiomas:</span>
                        <span className="text-gray-900">{doctor.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doctor.acceptsInsurance && (
                          <Badge className="bg-green-100 text-green-700">
                            Aceita Plano
                          </Badge>
                        )}
                        <Badge className={getAvailabilityColor(doctor.availability)}>
                          {doctor.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <Button 
                  className="flex-1 bg-teal-600 hover:bg-teal-700 h-12 text-base"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Consulta
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-12 text-base"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Ver Perfil
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 h-12 text-base"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contatar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum médico encontrado</h3>
            <p className="text-base text-gray-600">
              Tente ajustar os filtros de busca ou entre em contato conosco.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-teal-700 mb-2">
              {specialties.length}
            </div>
            <p className="text-base text-gray-600">Especialidades</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-blue-700 mb-2">
              {doctors.length}
            </div>
            <p className="text-base text-gray-600">Médicos Credenciados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-green-700 mb-2">
              {doctors.filter(d => d.availability.includes('hoje')).length}
            </div>
            <p className="text-base text-gray-600">Disponíveis Hoje</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-semibold text-purple-700 mb-2">
              4.8
            </div>
            <p className="text-base text-gray-600">Avaliação Média</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}