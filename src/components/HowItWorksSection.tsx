import { motion } from 'motion/react';
import { Download, LogIn, CheckCircle, Smartphone } from 'lucide-react';

const steps = [
  {
    icon: Download,
    title: 'Baixe o app',
    description: 'Disponível na Play Store e App Store (ou cadastre-se para ser avisado)',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: LogIn,
    title: 'Faça login com CPF',
    description: 'Acesso seguro e rápido com seu CPF',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: CheckCircle,
    title: 'Autorize suas clínicas',
    description: 'Permita que suas clínicas enviem exames e receitas',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Smartphone,
    title: 'Tenha tudo na palma da mão',
    description: 'Acesse seu histórico médico completo a qualquer momento',
    color: 'from-orange-500 to-red-500'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-900 mb-16"
          style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          Como funciona?
        </motion.h2>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-100 z-10">
                  <span className="text-2xl text-[#00796B]">{index + 1}</span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl h-full relative overflow-hidden">
                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-gray-900 mb-4 text-center" style={{ fontSize: 'clamp(1.375rem, 2vw, 1.75rem)' }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)' }}>
                    {step.description}
                  </p>

                  {/* Connecting Line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-gray-600 mb-6" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
              Simples assim! Em menos de 5 minutos você está pronto.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
