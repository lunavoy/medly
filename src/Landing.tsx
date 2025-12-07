import { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { BenefitsSection } from './components/BenefitsSection';
import { ProofSection } from './components/ProofSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ClinicsSection } from './components/ClinicsSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { SignupModal } from './components/SignupModal';
import { AccessibilityControls } from './components/AccessibilityControls';

interface LandingProps {
  onClose?: () => void;
}

export default function Landing({ onClose }: LandingProps) {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'patient' | 'clinic'>('patient');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const openSignupModal = (type: 'patient' | 'clinic') => {
    setModalType(type);
    setIsSignupModalOpen(true);
  };

  return (
    <div className={`fixed inset-0 bg-white overflow-y-auto z-50 ${highContrast ? 'high-contrast' : ''} ${fontSize === 'large' ? 'text-large' : fontSize === 'xlarge' ? 'text-xlarge' : ''}`}>
      <AccessibilityControls 
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Experimente o App Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 left-4 z-50 bg-gradient-to-r from-[#00796B] to-[#00ACC1] text-white hover:shadow-xl shadow-lg rounded-full px-8 py-4 transition-all hover:scale-105"
          style={{ fontSize: 'clamp(1.125rem, 1.75vw, 1.5rem)', minHeight: '48px' }}
        >
          Experimente o App
        </button>
      )}
      
      <HeroSection onOpenSignup={openSignupModal} />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <ProofSection />
      <HowItWorksSection />
      <ClinicsSection onOpenSignup={openSignupModal} />
      <FAQSection />
      <FinalCTASection onOpenSignup={openSignupModal} />

      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        type={modalType}
      />
    </div>
  );
}