import { motion } from 'motion/react';
import { FileCheck, Clock, Bell, Shield, Users, AlertCircle } from 'lucide-react';

const benefits = {
  patient: {
    title: 'Para você',
    items: [
      { icon: FileCheck, text: 'Chega de carregar papel' },
      { icon: Clock, text: 'Mostre seu exame antigo em 3 segundos' },
      { icon: Bell, text: 'Receba lembrete de remédios e consultas' },
      { icon: Shield, text: 'Seus dados protegidos como no banco' }
    ]
  },
  family: {
    title: 'Para sua família',
    items: [
      { icon: Users, text: 'Acompanhe a saúde dos pais à distância' },
      { icon: AlertCircle, text: 'Receba alertas se algo importante acontecer' }
    ]
  },
  doctors: {
    title: 'Para médicos e clínicas',
    items: [
      { icon: FileCheck, text: 'Paciente chega com histórico completo' },
      { icon: Clock, text: 'Menos faltas, agenda otimizada' }
    ]
  }
};

export function BenefitsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-900 mb-16"
          style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          Benefícios para todos
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Para o Paciente */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h3 className="text-[#00796B] mb-8 text-center" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}>
              {benefits.patient.title}
            </h3>
            <div className="space-y-6">
              {benefits.patient.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#00796B] to-[#00ACC1] rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-gray-700 pt-2" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Para a Família */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h3 className="text-[#00796B] mb-8 text-center" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}>
              {benefits.family.title}
            </h3>
            <div className="space-y-6">
              {benefits.family.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-gray-700 pt-2" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Para Médicos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl"
          >
            <h3 className="text-[#00796B] mb-8 text-center" style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}>
              {benefits.doctors.title}
            </h3>
            <div className="space-y-6">
              {benefits.doctors.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-gray-700 pt-2" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
