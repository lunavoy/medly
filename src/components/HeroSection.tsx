import { motion } from 'motion/react';
import { Shield, Lock, Award } from 'lucide-react';

interface HeroSectionProps {
  onOpenSignup: (type: 'patient' | 'clinic') => void;
}

export function HeroSection({ onOpenSignup }: HeroSectionProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #00796B 0%, #00ACC1 100%)'
      }}
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1758686254056-6cd980b9aaee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVyc29uJTIwc21pbGluZyUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzY1MTI1MTY2fDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white mb-8"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: '1.1' }}
          >
            Seu histórico médico completo, sempre com você.<br />
            <span className="block mt-4">Chega de repetir exames e perder tempo.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/95 mb-12 max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: '1.4' }}
          >
            Med.ly reúne consultas, exames, receitas e agenda em um só lugar seguro. 
            Feito para quem valoriza saúde de verdade.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <button
              onClick={() => onOpenSignup('patient')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', minWidth: '48px', minHeight: '48px' }}
            >
              Quero ser avisado do lançamento
            </button>

            <button
              onClick={() => onOpenSignup('clinic')}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-8 py-6 rounded-full backdrop-blur-sm transform hover:scale-105 transition-all"
              style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', minWidth: '48px', minHeight: '48px' }}
            >
              Sou médico/clínica → Falar com o time
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-8 text-white/90"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <span>Em conformidade com LGPD</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8" />
              <span>Criptografia bancária</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <span>Parceria com PJ Alves Cardiologia</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}
