import { motion } from 'motion/react';
import { FileText, Calendar, Share2 } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Histórico completo',
    description: 'Exames, consultas e receitas em um só lugar'
  },
  {
    icon: Calendar,
    title: 'Marcação online',
    description: 'Agende consultas em poucos toques'
  },
  {
    icon: Share2,
    title: 'Compartilhamento seguro',
    description: 'Compartilhe com qualquer médico de forma protegida'
  }
];

export function SolutionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-900 mb-12"
          style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          Tudo que você precisa, em um só lugar seguro
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gradient-to-r from-[#00796B] to-[#00ACC1] px-6 py-3">
                    <div className="flex justify-between items-center text-white text-sm">
                      <span>9:41</span>
                      <span>●●●●●</span>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00796B] to-[#00ACC1] rounded-full" />
                      <div>
                        <p className="text-sm text-gray-600">Olá,</p>
                        <p className="text-xl text-gray-900">Maria Silva</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-sm text-gray-600">Próxima Consulta</p>
                        <p className="text-lg text-gray-900">Dr. João - 15/12</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <p className="text-sm text-gray-600">Últimos Exames</p>
                        <p className="text-lg text-gray-900">Hemograma - 28/11</p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-sm text-gray-600">Medicação Atual</p>
                        <p className="text-lg text-gray-900">3 medicamentos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00796B]/20 to-[#00ACC1]/20 rounded-[3rem] blur-3xl -z-10" />
            </div>
          </motion.div>

          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#00796B] to-[#00ACC1] rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00796B] to-[#00ACC1]">
              <div className="text-center text-white p-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
                <p style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                  Veja como é simples usar o Med.ly
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
