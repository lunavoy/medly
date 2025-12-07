import { motion } from 'motion/react';
import { Mail, Users, Sparkles } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenSignup: (type: 'patient' | 'clinic') => void;
}

export function FinalCTASection({ onOpenSignup }: FinalCTASectionProps) {
  return (
    <section 
      className="py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Sparkles className="w-24 h-24 text-white mx-auto mb-6" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1' }}
          >
            Seja um dos primeiros a usar o Med.ly
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/95 mb-12 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(1.375rem, 2.5vw, 2rem)' }}
          >
            Cadastre-se agora e seja avisado assim que lançarmos. 
            Você terá acesso prioritário e benefícios exclusivos!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <button
              onClick={() => onOpenSignup('patient')}
              className="bg-white text-orange-600 px-16 py-8 rounded-full shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center gap-4"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', minWidth: '48px', minHeight: '48px' }}
            >
              <Mail className="w-8 h-8" />
              Quero ser avisado do lançamento
            </button>
          </motion.div>

          {/* Counter */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 inline-block border border-white/30"
          >
            <div className="flex items-center gap-4 text-white">
              <Users className="w-10 h-10" />
              <div className="text-left">
                <p style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>1.247</p>
                <p style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                  pessoas já na lista de espera
                </p>
              </div>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/90 mt-8"
            style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)' }}
          >
            Lançamento previsto: <span className="text-white">Março de 2026</span>
          </motion.p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
}
