import { motion } from 'motion/react';
import { TrendingDown, FileText, BarChart3, ArrowRight } from 'lucide-react';

interface ClinicsSectionProps {
  onOpenSignup: (type: 'patient' | 'clinic') => void;
}

const benefits = [
  {
    icon: TrendingDown,
    title: 'Redução de 70% nas faltas',
    description: 'Lembretes automáticos e confirmação simplificada'
  },
  {
    icon: FileText,
    title: 'Histórico completo na consulta',
    description: 'Paciente chega com todos os exames e informações'
  },
  {
    icon: BarChart3,
    title: 'Dashboard com taxa de ocupação',
    description: 'Gerencie sua agenda com dados em tempo real'
  }
];

export function ClinicsSection({ onOpenSignup }: ClinicsSectionProps) {
  return (
    <section 
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #00796B 100%)'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white mb-6"
          style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          Clínicas e médicos
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white/90 mb-16 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(1.375rem, 2vw, 1.875rem)' }}
        >
          Integre-se gratuitamente e ofereça uma experiência moderna aos seus pacientes
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <benefit.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-white mb-4" style={{ fontSize: 'clamp(1.375rem, 2vw, 1.75rem)' }}>
                {benefit.title}
              </h3>
              <p className="text-white/80 leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)' }}>
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => onOpenSignup('clinic')}
            className="bg-white text-[#00796B] px-12 py-6 rounded-full shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center gap-3"
            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', minWidth: '48px', minHeight: '48px' }}
          >
            Quero integrar minha clínica
            <ArrowRight className="w-6 h-6" />
          </button>

          <p className="text-white/80 mt-6" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            Gratuito para clínicas. Recursos premium opcionais disponíveis.
          </p>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
    </section>
  );
}
