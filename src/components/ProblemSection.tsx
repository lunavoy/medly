import { motion } from 'motion/react';
import { FileQuestion, FolderOpen, Phone, Pill } from 'lucide-react';

const problems = [
  {
    icon: FileQuestion,
    text: 'Repetir exames porque o médico anterior sumiu com o resultado'
  },
  {
    icon: FolderOpen,
    text: 'Levar pasta de papel para toda consulta'
  },
  {
    icon: Phone,
    text: 'Perder horas no telefone marcando consulta'
  },
  {
    icon: Pill,
    text: 'Não lembrar quais remédios está tomando'
  }
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-900 mb-16"
          style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
        >
          Você já passou por isso?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100"
            >
              <problem.icon className="w-16 h-16 text-[#00796B] mb-6" strokeWidth={1.5} />
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}>
                {problem.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 text-[#00796B]"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
        >
          Em 2025, isso não precisa mais acontecer.
        </motion.p>
      </div>
    </section>
  );
}
