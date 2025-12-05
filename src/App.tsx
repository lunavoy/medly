import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Activity, 
  Heart, 
  Calendar,
  Menu,
  X,
  Shield,
  Phone,
  Settings
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { DashboardOverview } from './components/DashboardOverview';
import { DoctorsDirectory } from './components/DoctorsDirectory';
import { ExamsTests } from './components/ExamsTests';
import { GoogleFitData } from './components/GoogleFitData';
import { HealthPlan } from './components/HealthPlan';
import { AppointmentFlow } from './components/AppointmentFlow';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  // Mock user data for demonstration
  const user = {
    name: 'Maria Silva',
    age: 68,
    healthPlan: 'Amil Saúde Premium',
    memberSince: 'Janeiro 2019'
  };

  const navigationItems = [
    {
      id: 'overview',
      label: 'Início',
      icon: Home,
      description: 'Visão geral da sua saúde'
    },
    {
      id: 'doctors',
      label: 'Médicos',
      icon: Users,
      description: 'Encontre especialistas'
    },
    {
      id: 'exams',
      label: 'Exames',
      icon: FileText,
      description: 'Seus resultados'
    },
    {
      id: 'fitness',
      label: 'Atividade',
      icon: Activity,
      description: 'Dados do Google Fit'
    },
    {
      id: 'plan',
      label: 'Plano de Saúde',
      icon: Shield,
      description: 'Cobertura e benefícios'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} />;
      case 'doctors':
        return <DoctorsDirectory />;
      case 'exams':
        return <ExamsTests />;
      case 'fitness':
        return <GoogleFitData />;
      case 'plan':
        return <HealthPlan user={user} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  const currentTab = navigationItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Now slides from right */}
      <aside className={`fixed top-0 right-0 z-50 w-80 h-full bg-white shadow-xl transform ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">HealthCare+</h1>
              <p className="text-sm text-gray-600">Sua saúde em primeiro lugar</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-teal-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">{user.name}</h2>
              <p className="text-base text-gray-600">{user.age} anos</p>
              <div className="flex items-center mt-1">
                <Shield className="w-4 h-4 text-teal-600 mr-1" />
                <span className="text-sm text-teal-700">{user.healthPlan}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-4 p-4 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                <div>
                  <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${isActive ? 'text-teal-100' : 'text-gray-600'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Emergency Contact */}
        <div className="absolute bottom-6 left-4 right-4">
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Emergência 24h</p>
                  <p className="text-sm text-red-700">(11) 0800-123-4567</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <div>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-teal-100 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentTab?.label}
              </h1>
              <p className="text-base text-gray-600">
                {currentTab?.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setAppointmentOpen(true)}
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Agendar Consulta</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Quick Access Floating Button - Removed since menu is now in header */}
      </div>

      {/* Appointment Flow Modal */}
      <AppointmentFlow
        isOpen={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
        userName={user.name}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}