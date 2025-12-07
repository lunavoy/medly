import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Building } from 'lucide-react';
import { useState } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'patient' | 'clinic';
}

export function SignupModal({ isOpen, onClose, type }: SignupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinicName: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Form submitted:', { ...formData, type });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', clinicName: '' });
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#00796B] to-[#00ACC1] p-8 relative">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Fechar"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>

                    <h2 className="text-white pr-12" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                      {type === 'patient' 
                        ? 'Cadastre-se para ser avisado!' 
                        : 'Quero integrar minha clínica'}
                    </h2>
                    <p className="text-white/90 mt-2" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                      {type === 'patient'
                        ? 'Preencha os dados abaixo e seja um dos primeiros a usar o Med.ly'
                        : 'Nossa equipe entrará em contato para discutir a integração'}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                        <User className="w-5 h-5 text-[#00796B]" />
                        {type === 'patient' ? 'Seu nome completo' : 'Nome do responsável'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                        style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                        placeholder="Digite seu nome"
                      />
                    </div>

                    {/* Clinic Name (only for clinics) */}
                    {type === 'clinic' && (
                      <div>
                        <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                          <Building className="w-5 h-5 text-[#00796B]" />
                          Nome da clínica/consultório
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.clinicName}
                          onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                          style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                          placeholder="Digite o nome da clínica"
                        />
                      </div>
                    )}

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                        <Phone className="w-5 h-5 text-[#00796B]" />
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                        style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 mb-3" style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.375rem)' }}>
                        <Mail className="w-5 h-5 text-[#00796B]" />
                        E-mail
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#00796B] focus:outline-none transition-colors"
                        style={{ fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', minHeight: '48px' }}
                        placeholder="seu@email.com"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#00796B] to-[#00ACC1] text-white px-8 py-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all"
                      style={{ fontSize: 'clamp(1.25rem, 1.75vw, 1.5rem)', minHeight: '48px' }}
                    >
                      {type === 'patient' ? 'Quero ser avisado!' : 'Solicitar contato'}
                    </button>

                    <p className="text-gray-500 text-center" style={{ fontSize: 'clamp(0.875rem, 1.25vw, 1.125rem)' }}>
                      Seus dados estão protegidos pela LGPD e não serão compartilhados.
                    </p>
                  </form>
                </>
              ) : (
                /* Success Message */
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <h3 className="text-gray-900 mb-4" style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}>
                    Cadastro realizado!
                  </h3>
                  <p className="text-gray-600" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                    {type === 'patient'
                      ? 'Você receberá um e-mail assim que o Med.ly for lançado!'
                      : 'Nossa equipe entrará em contato em breve!'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
