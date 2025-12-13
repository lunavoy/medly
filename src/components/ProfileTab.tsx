import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Camera,
  Edit,
  Check,
  AlertTriangle,
  Phone,
  Upload,
  Download,
  Lock,
  Trash2,
  Fingerprint,
  Clock,
  X,
  Plus,
  FileText,
  Eye,
  UserCheck,
  Heart
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ProfileTabProps {
  user: {
    name: string;
    age: number;
    healthPlan: string;
  };
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'João Silva', phone: '(11) 98765-4321', relation: 'Filho' }
  ]);

  // Health data state
  const [healthData, setHealthData] = useState({
    bloodType: 'O+',
    allergies: ['Penicilina', 'Dipirona'],
    organDonor: true,
    bloodDonor: true,
    hasDisability: false,
    disabilities: [] as string[],
    chronicConditions: ['Hipertensão', 'Diabetes tipo 2']
  });

  // Documents state
  const [documents, setDocuments] = useState({
    photo: true,
    idFront: true,
    idBack: false,
    cpf: true,
    healthCard: false
  });

  const handleEditField = (field: string) => {
    setSelectedField(field);
    setShowBiometric(true);
  };

  const handleBiometricAuth = () => {
    setShowBiometric(false);
    setIsEditingHealth(true);
    toast.success('Autenticação biométrica realizada com sucesso!');
  };

  const handleSaveHealthData = () => {
    setIsEditingHealth(false);
    setSelectedField(null);
    const now = new Date().toLocaleString('pt-BR');
    toast.success(`Alteração salva e registrada em ${now}`);
  };

  const addAllergy = () => {
    const newAllergy = prompt('Digite a alergia:');
    if (newAllergy) {
      setHealthData({ ...healthData, allergies: [...healthData.allergies, newAllergy] });
    }
  };

  const removeAllergy = (index: number) => {
    const newAllergies = healthData.allergies.filter((_, i) => i !== index);
    setHealthData({ ...healthData, allergies: newAllergies });
  };

  const toggleChronicCondition = (condition: string) => {
    const exists = healthData.chronicConditions.includes(condition);
    if (exists) {
      setHealthData({
        ...healthData,
        chronicConditions: healthData.chronicConditions.filter(c => c !== condition)
      });
    } else {
      setHealthData({
        ...healthData,
        chronicConditions: [...healthData.chronicConditions, condition]
      });
    }
  };

  const handleUploadDocument = (docType: string) => {
    toast.success(`Foto do documento carregada com sucesso!`);
    setDocuments({ ...documents, [docType]: true });
  };

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Não sei'];
  const chronicOptions = [
    'Diabetes',
    'Hipertensão',
    'Asma',
    'Epilepsia',
    'Cardiopatia',
    'Obesidade',
    'Câncer',
    'HIV',
    'Hepatite',
    'Doença renal crônica'
  ];
  const disabilityOptions = ['Visual', 'Auditiva', 'Motora', 'Intelectual', 'Psicossocial'];

  const completedDocs = Object.values(documents).filter(Boolean).length;
  const totalDocs = Object.keys(documents).length;
  const progressPercentage = (completedDocs / totalDocs) * 100;

  return (
    <div className="space-y-8 pb-8">
      {/* Section 1 - Verified Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">Dados verificados por documento</h2>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  <Shield className="w-5 h-5" />
                  <span className="text-base">Verificado com sucesso</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDocuments(true)}
                className="border-teal-300 text-teal-700"
              >
                <Eye className="w-5 h-5 mr-2" />
                Ver documentos enviados
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-5xl shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <p className="text-center text-gray-600 mt-2 text-sm">Foto 3×4</p>
              </div>

              {/* Verified Information */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Nome completo</p>
                  <p className="text-gray-900 text-lg">{user.name}</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">CPF</p>
                  <p className="text-gray-900 text-lg">123.456.789-**</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Data de nascimento</p>
                  <p className="text-gray-900 text-lg">15 de março de 1956</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">E-mail cadastrado</p>
                  <p className="text-gray-900 text-lg">maria.silva@email.com</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Sexo</p>
                  <p className="text-gray-900 text-lg">Feminino</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Nome da mãe</p>
                  <p className="text-gray-900 text-lg">Ana Oliveira Silva</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 2 - Editable Health Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-teal-200">
          <CardContent className="p-8">
            <h2 className="text-2xl text-gray-900 mb-4">Minhas informações de saúde</h2>
            
            {/* Warning Banner */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-900 text-lg">
                  Essas informações são muito importantes para emergências. 
                  Toda alteração fica registrada com data e hora.
                </p>
              </div>
            </div>

            {/* Health Data Fields */}
            <div className="space-y-4">
              {/* Blood Type */}
              <Card className="border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer" onClick={() => handleEditField('bloodType')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 mb-1">Tipo sanguíneo e fator RH</p>
                      <p className="text-gray-900 text-xl">{healthData.bloodType}</p>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                        <Clock className="w-4 h-4" />
                        <span>Editado em 08/12/2025 às 14:32</span>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-teal-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Allergies */}
              <Card className="border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer" onClick={() => handleEditField('allergies')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 mb-2">Alergias medicamentosas ou alimentares</p>
                      <div className="flex flex-wrap gap-2">
                        {healthData.allergies.map((allergy, idx) => (
                          <span key={idx} className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-base">
                            {allergy}
                          </span>
                        ))}
                        {healthData.allergies.length === 0 && (
                          <span className="text-gray-500">Nenhuma alergia cadastrada</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                        <Clock className="w-4 h-4" />
                        <span>Editado em 05/12/2025 às 10:15</span>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-teal-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Organ Donor Switch */}
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Heart className="w-6 h-6 text-pink-600" />
                      <div>
                        <p className="text-gray-900 text-lg">Sou doador de órgãos</p>
                        <p className="text-gray-600 text-sm">Ajude a salvar vidas</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setHealthData({ ...healthData, organDonor: !healthData.organDonor })}
                      className={`relative w-16 h-8 rounded-full transition-colors ${
                        healthData.organDonor ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        healthData.organDonor ? 'translate-x-8' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Blood Donor Switch */}
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Heart className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="text-gray-900 text-lg">Posso doar sangue</p>
                        <p className="text-gray-600 text-sm">Doe sangue, doe vida</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setHealthData({ ...healthData, bloodDonor: !healthData.bloodDonor })}
                      className={`relative w-16 h-8 rounded-full transition-colors ${
                        healthData.bloodDonor ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        healthData.bloodDonor ? 'translate-x-8' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Chronic Conditions */}
              <Card className="border border-gray-200 hover:border-teal-300 transition-colors cursor-pointer" onClick={() => handleEditField('chronicConditions')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 mb-2">Condições crônicas ou doenças importantes</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {healthData.chronicConditions.map((condition, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-base">
                            {condition}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Editado em 01/12/2025 às 16:45</span>
                      </div>
                    </div>
                    <Edit className="w-5 h-5 text-teal-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 3 - Documents Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 border-teal-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-gray-900">Documentos e foto</h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Documentos completos</p>
                  <p className="text-teal-700 text-xl">{completedDocs} de {totalDocs}</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#00796B"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-teal-700">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo 3x4 */}
              <Card className={`border-2 ${documents.photo ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                <CardContent className="p-6 text-center">
                  {documents.photo ? (
                    <>
                      <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                        <Check className="w-5 h-5" />
                        <span>Enviada</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    </>
                  )}
                  <p className="text-gray-900 mb-2">Foto 3×4</p>
                  <p className="text-gray-600 text-sm mb-4">Fundo branco, rosto centralizado, sem óculos escuros</p>
                  <Button
                    onClick={() => handleUploadDocument('photo')}
                    variant="outline"
                    className="w-full border-teal-300 text-teal-700"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {documents.photo ? 'Trocar foto' : 'Tirar foto'}
                  </Button>
                </CardContent>
              </Card>

              {/* ID Document */}
              <Card className={`border-2 ${documents.idFront && documents.idBack ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                <CardContent className="p-6 text-center">
                  <FileText className={`w-12 h-12 mx-auto mb-4 ${documents.idFront ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="text-gray-900 mb-2">RG, CNH ou RNE</p>
                  <div className="space-y-2 mb-4">
                    <div className={`flex items-center justify-between p-2 rounded ${documents.idFront ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <span className="text-sm">Frente</span>
                      {documents.idFront && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded ${documents.idBack ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <span className="text-sm">Verso</span>
                      {documents.idBack && <Check className="w-4 h-4 text-green-600" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleUploadDocument('idFront')}
                      variant="outline"
                      className="w-full border-teal-300 text-teal-700"
                      size="sm"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Fotografar frente
                    </Button>
                    <Button
                      onClick={() => handleUploadDocument('idBack')}
                      variant="outline"
                      className="w-full border-teal-300 text-teal-700"
                      size="sm"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Fotografar verso
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Health Card */}
              <Card className={`border-2 ${documents.healthCard ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                <CardContent className="p-6 text-center">
                  <Shield className={`w-12 h-12 mx-auto mb-4 ${documents.healthCard ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="text-gray-900 mb-2">Carteirinha do plano</p>
                  <p className="text-gray-600 text-sm mb-4">{user.healthPlan}</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleUploadDocument('healthCard')}
                      variant="outline"
                      className="w-full border-teal-300 text-teal-700"
                      size="sm"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Fotografar frente
                    </Button>
                    <Button
                      onClick={() => handleUploadDocument('healthCard')}
                      variant="outline"
                      className="w-full border-teal-300 text-teal-700"
                      size="sm"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Fotografar verso
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 4 - Extra Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        {/* Emergency Contacts */}
        <Card className="border-2 border-red-200">
          <CardContent className="p-8">
            <h2 className="text-2xl text-gray-900 mb-4">Em caso de emergência, ligar para</h2>
            <div className="space-y-4 mb-4">
              {emergencyContacts.map((contact, idx) => (
                <Card key={idx} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="text-gray-900 text-lg">{contact.name}</p>
                          <p className="text-gray-600">{contact.phone}</p>
                          <p className="text-gray-500 text-sm">{contact.relation}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-5 h-5 text-teal-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {emergencyContacts.length < 3 && (
              <Button
                onClick={() => toast.info('Funcionalidade de adicionar contato será implementada')}
                variant="outline"
                className="w-full border-red-300 text-red-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar contato de emergência
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Share Profile with Doctor */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-gray-900 text-lg mb-1">Liberar meu perfil completo para o médico</p>
                  <p className="text-gray-600 text-sm">Dr. Paulo Juvenal Alves pode acessar todo seu histórico</p>
                  <p className="text-gray-500 text-sm mt-1">Última liberação: 01/12/2025 às 10:00</p>
                </div>
              </div>
              <button
                className="relative w-16 h-8 rounded-full bg-green-500"
              >
                <span className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow translate-x-8" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card className="border-2 border-teal-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Download className="w-8 h-8 text-teal-600" />
                <div>
                  <p className="text-gray-900 text-lg mb-1">Exportar todos os meus dados</p>
                  <p className="text-gray-600 text-sm">Baixe um PDF completo com todo seu histórico médico (LGPD)</p>
                </div>
              </div>
              <Button
                onClick={() => toast.success('PDF gerado com sucesso! Iniciando download...')}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-2 border-gray-200">
          <CardContent className="p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Configurações do perfil</h2>
            <div className="space-y-4">
              <Button
                onClick={() => toast.info('Funcionalidade de alterar senha será implementada')}
                variant="outline"
                className="w-full justify-start border-teal-300 text-teal-700"
              >
                <Lock className="w-5 h-5 mr-3" />
                Alterar senha
              </Button>
              <Button
                onClick={() => toast.success('Biometria ativada com sucesso!')}
                variant="outline"
                className="w-full justify-start border-teal-300 text-teal-700"
              >
                <Fingerprint className="w-5 h-5 mr-3" />
                Ativar/desativar biometria
              </Button>
              <Button
                onClick={() => toast.error('Tem certeza? Esta ação não pode ser desfeita.')}
                variant="outline"
                className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Excluir conta permanentemente
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Biometric Authentication Modal */}
      <AnimatePresence>
        {showBiometric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBiometric(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Fingerprint className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-3">Autenticação necessária</h3>
                <p className="text-gray-600 text-lg mb-8">
                  Por segurança, confirme sua identidade para editar informações de saúde
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleBiometricAuth}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-lg py-6"
                  >
                    <Fingerprint className="w-6 h-6 mr-3" />
                    Autenticar com biometria
                  </Button>
                  <Button
                    onClick={() => setShowBiometric(false)}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Documents Modal */}
      <AnimatePresence>
        {showDocuments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDocuments(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-gray-900">Documentos enviados</h3>
                <button
                  onClick={() => setShowDocuments(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-xl p-8 text-center aspect-[3/4]">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">RG - Frente</p>
                  <p className="text-gray-500 text-sm mt-2">Enviado em 01/12/2025</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-8 text-center aspect-[3/4]">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">CPF</p>
                  <p className="text-gray-500 text-sm mt-2">Enviado em 01/12/2025</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}