import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Calendar, Shield, Heart, ArrowLeft, UserPlus } from 'lucide-react';

interface LoginSignupProps {
  onLogin: (userData: any) => void;
  onBack?: () => void;
}

const healthPlans = [
  'Amil Saúde',
  'Bradesco Saúde',
  'SulAmérica',
  'Unimed',
  'NotreDame Intermédica',
  'Hapvida',
  'Porto Seguro Saúde',
  'Golden Cross',
  'Prevent Senior',
  'Outro'
];

export function LoginSignup({ onLogin, onBack }: LoginSignupProps) {
  const [mode, setMode] = useState<'login' | 'signup-patient' | 'signup-doctor'>('login');
  const [loginData, setLoginData] = useState({ cpf: '', password: '' });
  const [signupData, setSignupData] = useState({
    cpf: '',
    fullName: '',
    birthDate: '',
    healthPlan: '',
    password: '',
    confirmPassword: ''
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in production, validate against backend
    if (loginData.cpf && loginData.password) {
      onLogin({
        name: 'Maria Silva',
        cpf: loginData.cpf,
        age: 68,
        healthPlan: 'Amil Saúde Premium',
        memberSince: 'Janeiro 2019'
      });
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Simulate signup - in production, save to backend
    const birthDate = new Date(signupData.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    
    onLogin({
      name: signupData.fullName,
      cpf: signupData.cpf,
      age: age,
      healthPlan: signupData.healthPlan,
      memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, #00796B 0%, #00ACC1 100%)'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-white hover:text-white/80 transition-colors"
              style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)', minHeight: '48px' }}
            >
              <ArrowLeft className="w-6 h-6" />
              Voltar para o site
            </button>
          )}

          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl mb-4">
              <Heart className="w-12 h-12 text-[#00796B]" />
            </div>
            <h1 className="text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Med.ly
            </h1>
            <p className="text-white/90" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)' }}>
              Sua saúde, sempre com você
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Login Form */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
              >
                <h2 className="text-gray-900 mb-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                  Entrar na sua conta
                </h2>
                <p className="text-gray-600 mb-8" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                  Acesse seu histórico médico completo
                </p>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <User className="w-5 h-5 text-[#00796B]" />
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      value={loginData.cpf}
                      onChange={(e) => setLoginData({ ...loginData, cpf: formatCPF(e.target.value) })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <Lock className="w-5 h-5 text-[#00796B]" />
                      Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                      placeholder="Digite sua senha"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00796B] to-[#00ACC1] text-white px-8 py-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all"
                    style={{ fontSize: 'clamp(1.25rem, 1.75vw, 1.5rem)', minHeight: '48px' }}
                  >
                    Entrar
                  </button>

                  <div className="text-center space-y-4">
                    <button
                      type="button"
                      className="text-[#00796B] hover:underline"
                      style={{ fontSize: 'clamp(1rem, 1.25vw, 1.25rem)' }}
                    >
                      Esqueceu sua senha?
                    </button>

                    <div className="border-t pt-6">
                      <p className="text-gray-600 mb-4" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)' }}>
                        Ainda não tem conta?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          type="button"
                          onClick={() => setMode('signup-patient')}
                          className="flex-1 bg-white text-[#00796B] border-2 border-[#00796B] px-6 py-4 rounded-xl hover:bg-[#00796B] hover:text-white transition-all"
                          style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                        >
                          Cadastrar como Paciente
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode('signup-doctor')}
                          className="flex-1 bg-white text-blue-600 border-2 border-blue-600 px-6 py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                          style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                        >
                          Cadastrar como Médico
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Patient Signup Form */}
            {mode === 'signup-patient' && (
              <motion.div
                key="signup-patient"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
              >
                <h2 className="text-gray-900 mb-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                  Criar conta de paciente
                </h2>
                <p className="text-gray-600 mb-8" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                  Preencha seus dados para começar
                </p>

                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <User className="w-5 h-5 text-[#00796B]" />
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <User className="w-5 h-5 text-[#00796B]" />
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      value={signupData.cpf}
                      onChange={(e) => setSignupData({ ...signupData, cpf: formatCPF(e.target.value) })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <Calendar className="w-5 h-5 text-[#00796B]" />
                      Data de nascimento
                    </label>
                    <input
                      type="date"
                      required
                      value={signupData.birthDate}
                      onChange={(e) => setSignupData({ ...signupData, birthDate: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <Shield className="w-5 h-5 text-[#00796B]" />
                      Plano de saúde
                    </label>
                    <select
                      required
                      value={signupData.healthPlan}
                      onChange={(e) => setSignupData({ ...signupData, healthPlan: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors bg-white"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                    >
                      <option value="">Selecione seu plano</option>
                      {healthPlans.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <Lock className="w-5 h-5 text-[#00796B]" />
                      Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                      placeholder="Crie uma senha"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      <Lock className="w-5 h-5 text-[#00796B]" />
                      Confirmar senha
                    </label>
                    <input
                      type="password"
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                      placeholder="Digite a senha novamente"
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#00796B] to-[#00ACC1] text-white px-8 py-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    style={{ fontSize: 'clamp(1.25rem, 1.75vw, 1.5rem)', minHeight: '48px' }}
                  >
                    <UserPlus className="w-6 h-6" />
                    Criar conta
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#00796B] hover:underline"
                      style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)' }}
                    >
                      Já tem conta? Faça login
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Doctor Signup - Not Available */}
            {mode === 'signup-doctor' && (
              <motion.div
                key="signup-doctor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-12 h-12 text-blue-600" />
                </div>

                <h2 className="text-gray-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                  Cadastro de médicos
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)' }}>
                  O cadastro para médicos e clínicas ainda não está disponível. 
                  Nossa equipe está trabalhando nisso!
                </p>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                  <p className="text-gray-700" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                    Entre em contato conosco para manifestar interesse:
                  </p>
                  <a 
                    href="mailto:medicos@med.ly" 
                    className="text-[#00796B] hover:underline inline-block mt-2"
                    style={{ fontSize: 'clamp(1.25rem, 1.75vw, 1.5rem)' }}
                  >
                    medicos@med.ly
                  </a>
                </div>

                <button
                  onClick={() => setMode('login')}
                  className="bg-gradient-to-r from-[#00796B] to-[#00ACC1] text-white px-12 py-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all"
                  style={{ fontSize: 'clamp(1.25rem, 1.75vw, 1.5rem)', minHeight: '48px' }}
                >
                  Voltar para login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}