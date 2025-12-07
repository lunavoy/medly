import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'É pago?',
    answer: 'Não! O Med.ly é totalmente gratuito para pacientes. Clínicas e médicos podem usar gratuitamente também, com recursos premium opcionais para quem deseja funcionalidades avançadas.'
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Sim, absolutamente! Usamos criptografia de nível bancário para proteger todas as suas informações. Estamos em total conformidade com a LGPD e NUNCA vendemos seus dados. Seus dados médicos são seus e apenas você decide com quem compartilhar.'
  },
  {
    question: 'Funciona para idosos?',
    answer: 'Sim! O Med.ly foi especialmente projetado pensando em pessoas idosas. Temos letras grandes, contrastes claros, navegação intuitiva e estamos desenvolvendo comando de voz para facilitar ainda mais o uso.'
  },
  {
    question: 'Como faço para adicionar meus exames antigos?',
    answer: 'Existem três formas: 1) Tire uma foto do exame em papel e envie pelo app; 2) Autorize suas clínicas a enviarem automaticamente; 3) Faça upload de PDFs que você já tenha. Tudo fica organizado automaticamente.'
  },
  {
    question: 'Posso compartilhar com qualquer médico?',
    answer: 'Sim! Você pode gerar um link seguro ou um QR Code para compartilhar seus exames e histórico com qualquer médico, mesmo que ele não use o Med.ly. O compartilhamento é temporário e você controla o acesso.'
  },
  {
    question: 'Quando o app estará disponível?',
    answer: 'Estamos trabalhando duro! O lançamento está previsto para março de 2026. Cadastre-se para ser um dos primeiros a usar e receber notificações sobre o beta.'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          Perguntas frequentes
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                style={{ minHeight: '48px' }}
              >
                <span className="text-gray-900 pr-4" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-8 h-8 text-[#00796B] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-700 leading-relaxed" style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)' }}>
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
