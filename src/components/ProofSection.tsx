import { motion } from 'motion/react';
import { Quote, Award, Database, Star } from 'lucide-react';

export function ProofSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-900 mb-16"
          style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          Credibilidade e confiança
        </motion.h2>

        <div className="max-w-6xl mx-auto">
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#00796B] to-[#00ACC1] rounded-3xl p-12 mb-12 relative overflow-hidden"
          >
            <Quote className="absolute top-8 right-8 w-24 h-24 text-white/20" />
            <div className="relative z-10">
              <p className="text-white mb-8 leading-relaxed" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                "Finalmente consigo mostrar meus exames antigos sem depender da clínica. 
                Minha filha configurou para mim e agora está tudo no celular."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-2xl">MS</span>
                </div>
                <div>
                  <p className="text-white" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)' }}>
                    Maria de Lourdes, 72 anos
                  </p>
                  <p className="text-white/80" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
                    Brasília-DF
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-2xl p-8 text-center border-2 border-blue-200"
            >
              <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-900" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)' }}>
                Em desenvolvimento com<br />
                <span className="text-blue-600">PJ Alves Cardiologia</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-2xl p-8 text-center border-2 border-green-200"
            >
              <Database className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-gray-900" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)' }}>
                Tecnologia alinhada à<br />
                <span className="text-green-600">RNDS (Rede Nacional de Dados em Saúde)</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-purple-50 rounded-2xl p-8 text-center border-2 border-purple-200"
            >
              <Star className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-900" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.375rem)' }}>
                Projeto premiado no<br />
                <span className="text-purple-600">UniCeub 2025 – Prêmio Destaque</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
