import React, { useState } from 'react';
import { useUserProfile } from './hooks/useSupabase';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  Settings,
  User
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import ProtectedRoute from './components/ProtectedRoute';
// Dialog removed: logout is a single action now
import { Avatar } from './components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './components/ui/dropdown-menu';
import { toast } from 'sonner';
import { DashboardOverview } from './components/DashboardOverview';
import { DoctorsDirectory } from './components/DoctorsDirectory';
import { ExamsTests } from './components/ExamsTests';
import { GoogleFitData } from './components/GoogleFitData';
import { HealthPlan } from './components/HealthPlan';
import { AppointmentFlow } from './components/AppointmentFlow';
import { ProfileTab } from './components/ProfileTab';
import { Toaster } from './components/ui/sonner';
import Landing from './Landing';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import DoctorPatientProfilePage from './pages/DoctorPatientProfilePage';
import DoctorProtectedRoute from './components/DoctorProtectedRoute';
import { useAuth } from './AuthProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const { profile } = useUserProfile()
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, signOut, loading: authLoading } = useAuth();

  // Do not block the whole app render while the profile is loading —
  // components will show their own loaders when necessary.

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
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      description: 'Seus dados e documentos'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={profile} />;
      case 'doctors':
        return <DoctorsDirectory onOpenAppointmentFlow={() => setAppointmentOpen(true)} />;
      case 'exams':
        return <ExamsTests />;
      case 'fitness':
        return <GoogleFitData />;
      case 'plan':
        return <HealthPlan user={profile} />;
      case 'profile':
        return <ProfileTab user={profile} />;
      default:
        return <DashboardOverview user={profile} />;
    }
  };

  const currentTab = navigationItems.find(item => item.id === activeTab);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/doctor/login" element={<DoctorLoginPage />} />
      <Route path="/doctor/dashboard" element={<DoctorProtectedRoute><DoctorDashboardPage /></DoctorProtectedRoute>} />
      <Route path="/doctor/patients/:id" element={<DoctorProtectedRoute><DoctorPatientProfilePage /></DoctorProtectedRoute>} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
          {/* Mobile Menu Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
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
                  <h1 className="text-xl font-semibold text-gray-900">Med.ly</h1>
                  <p className="text-sm text-gray-600">Sua Saúde é Única</p>
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
                  {profile?.full_name?.charAt(0) ?? 'U'}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{profile?.full_name}</h2>
                  <div className="flex items-center mt-1">
                    <Shield className="w-4 h-4 text-teal-600 mr-1" />
                    <span className="text-sm text-teal-700">{profile?.health_plan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button - placed above the navigation list */}
            <div className="p-4 border-b border-teal-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">Conta</div>
              {authUser && (
                <Button
                  variant="destructive"
                  size="sm"
                  aria-label="Sair"
                  onClick={async () => {
                    try {
                      await signOut();
                      navigate('/login');
                    } catch (err) {
                      console.error('Erro ao sair:', err);
                    }
                  }}
                >
                  Sair
                </Button>
              )}
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

            {/* Logout button performs a straightforward signOut and navigation */}

            {/* Emergency Contact */}
            <div className="absolute bottom-6 left-4 right-4">
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Emergência 24h</p>
                      <p className="text-sm text-red-700">192 - Samu</p>
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
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                {currentTab?.icon && <currentTab.icon className="w-6 h-6 mr-3 text-teal-600" />}
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

              {/* Login/Logout control */}
              {authLoading && location.pathname.startsWith('/dashboard') ? (
                <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
              ) : (authUser || location.pathname.startsWith('/dashboard')) ? (
                <>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Avatar className="w-8 h-8" />
                        <span className="hidden sm:inline">{authUser?.email ? authUser.email.split('@')[0] : 'Perfil'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => { setActiveTab('profile'); navigate('/dashboard'); }}>Perfil</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                {/* Sidebar: logout button performs signOut */}
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-teal-300 text-teal-700 hover:bg-teal-50"
                >
                  Entrar
                </Button>
              )}
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
        userName={profile?.full_name}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" />

      </div>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
