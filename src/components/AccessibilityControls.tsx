import { Settings, Type, Eye } from 'lucide-react';
import { useState } from 'react';

interface AccessibilityControlsProps {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (value: 'normal' | 'large' | 'xlarge') => void;
}

export function AccessibilityControls({ 
  highContrast, 
  setHighContrast, 
  fontSize, 
  setFontSize 
}: AccessibilityControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg rounded-full p-4 hover:bg-gray-50 transition-colors border-2 border-gray-200"
        aria-label="Configurações de acessibilidade"
        style={{ minWidth: '48px', minHeight: '48px' }}
      >
        <Settings className="w-6 h-6 text-[#00796B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-6">
          <h3 className="text-xl mb-4">Acessibilidade</h3>
          
          <div className="space-y-4">
            {/* Alto Contraste */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5" />
                  Alto Contraste
                </span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-6 h-6 cursor-pointer"
                />
              </label>
            </div>

            {/* Tamanho da Fonte */}
            <div>
              <label className="flex items-center gap-2 text-lg mb-2">
                <Type className="w-5 h-5" />
                Tamanho da Fonte
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                    fontSize === 'normal' 
                      ? 'bg-[#00796B] text-white border-[#00796B]' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#00796B]'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  Normal
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                    fontSize === 'large' 
                      ? 'bg-[#00796B] text-white border-[#00796B]' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#00796B]'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  Grande
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                    fontSize === 'xlarge' 
                      ? 'bg-[#00796B] text-white border-[#00796B]' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#00796B]'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  Maior
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
