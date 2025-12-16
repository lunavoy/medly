import { useEffect, useState } from 'react';
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
import { supabase } from '../supabase/client';

interface ProfileTabProps {
  user?: any;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [healthProfileId, setHealthProfileId] = useState<string | number | null>(null);
  const [comorbidityIdByName, setComorbidityIdByName] = useState<Record<string, string | number>>({});
  const [bloodTypeOptions, setBloodTypeOptions] = useState<Array<{ id: string | number; label: string }>>([]);
  const [allComorbidityOptions, setAllComorbidityOptions] = useState<Array<{ id: string | number; name: string }>>([]);
  const [lastModifiedAt, setLastModifiedAt] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    cpf: '',
    email: ''
  });
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

  const formatLastModified = (dateString: string | null): string => {
    if (!dateString) return 'Nunca editado';
    try {
      const date = new Date(dateString);
      // Add 1 hour to fix timezone offset
      date.setHours(date.getHours() + 1);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `Editado em ${day}/${month}/${year} às ${hours}:${minutes}`;
    } catch {
      return 'Data inválida';
    }
  };

  const formatBirthDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day} de ${['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][date.getMonth()]} de ${year}`;
    } catch {
      return dateString;
    }
  };

  const maskCPF = (cpf: string | null): string => {
    if (!cpf) return '-';
    // Remove tudo que não é número
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length < 11) return cpf;
    // Mascara os últimos 5 dígitos
    return cleaned.slice(0, 6) + '*'.repeat(5);
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

  const addAllergy = async () => {
    const newAllergy = prompt('Digite a alergia:');
    if (newAllergy) {
      const nextAllergies = [...healthData.allergies, newAllergy];
      setHealthData({ ...healthData, allergies: nextAllergies });
      await persistAllergies(nextAllergies);
    }
  };

  const removeAllergy = async (index: number) => {
    const newAllergies = healthData.allergies.filter((_, i) => i !== index);
    setHealthData({ ...healthData, allergies: newAllergies });
    await persistAllergies(newAllergies);
  };

  const toggleChronicCondition = async (condition: string) => {
    const exists = healthData.chronicConditions.includes(condition);
    if (exists) {
      const next = healthData.chronicConditions.filter(c => c !== condition);
      setHealthData({ ...healthData, chronicConditions: next });
      await persistComorbidities(next);
    } else {
      const next = [...healthData.chronicConditions, condition];
      setHealthData({ ...healthData, chronicConditions: next });
      await persistComorbidities(next);
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

  // Load real data for profile, blood types, and comorbidities
  useEffect(() => {
    const loadHealthData = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth?.user?.id;
        if (!userId) {
          console.log('[ProfileTab] No user auth');
          return;
        }
        setProfileId(userId);

        // Fetch user profile data (full_name, birth_date, gender, cpf, email)
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, birth_date, gender, cpf, email')
            .eq('id', userId)
            .single();
          
          if (profileError) {
            console.error('[ProfileTab] Profile fetch error:', profileError);
          } else if (profile) {
            console.log('[ProfileTab] Profile data:', profile);
            setProfileData({
              fullName: profile.full_name || '-',
              birthDate: profile.birth_date || '-',
              gender: profile.gender || '-',
              cpf: profile.cpf || '-',
              email: profile.email || '-'
            });
          }
        } catch (e) {
          console.error('[ProfileTab] Cannot fetch profile:', e);
        }

        // Fetch blood types list (id, type, rh_factor) and build label map: `${type}${rh_factor}`
        let bloodTypeLabelById: Record<string | number, string> = {};
        let btList: Array<{ id: string | number; label: string }> = [];
        try {
          const { data: bt } = await supabase
            .from('blood_types')
            .select('id, type, rh_factor')
            .order('id');
          console.log('[ProfileTab] Blood types result:', bt);
          if (bt && bt.length) {
            bloodTypeLabelById = bt.reduce((acc: any, row: any) => {
              const label = `${row.type ?? ''}${row.rh_factor ?? ''}`.trim();
              acc[row.id] = label || `${row.type ?? ''}`;
              return acc;
            }, {} as Record<string | number, string>);
            btList = bt.map((row: any) => ({
              id: row.id,
              label: `${row.type ?? ''}${row.rh_factor ?? ''}`.trim() || `${row.type ?? ''}`
            }));
            setBloodTypeOptions(btList);
          }
        } catch (e) {
          console.error('[ProfileTab] Blood types fetch error:', e);
          // keep fallback bloodTypes constant
        }

        // Fetch patient health profile by profile_id
        let php = null;
        try {
          const { data, error } = await supabase
            .from('patient_health_profile')
            .select('*')
            .eq('profile_id', userId)
            .maybeSingle();
          if (error) {
            console.error('[ProfileTab] Patient health profile error:', error);
          } else {
            php = data;
            console.log('[ProfileTab] Patient health profile:', php);
            if (php?.id) {
              setHealthProfileId(php.id);
              if (php.last_modified_at) {
                setLastModifiedAt(php.last_modified_at);
              }
            }
          }
        } catch (e) {
          console.error('[ProfileTab] Cannot fetch patient_health_profile:', e);
        }

        // Fetch comorbidities options and patient's comorbidities via link table
        let comorbidityNameById: Record<string | number, string> = {};
        let userComorbidityIds: Array<string | number> = [];
        try {
          const [{ data: allComorbs }, { data: links }] = await Promise.all([
            // If the column is literally "Nome da Comorbidade" (with space/case), alias it to name
            supabase.from('comorbidities').select('id, name'),
            php?.id
              ? supabase
                  .from('patient_comorbidities')
                  .select('comorbidity_id')
                  .eq('patient_health_profile_id', php.id)
              : Promise.resolve({ data: [], error: null })
          ] as any);
          if (allComorbs) {
            comorbidityNameById = allComorbs.reduce((acc: any, row: any) => {
              const nm = row.name || row.Nome || row.nome || row.title;
              acc[row.id] = nm;
              return acc;
            }, {} as Record<string | number, string>);
            // Set comorbidity options for the checklist UI
            setAllComorbidityOptions(allComorbs.map((row: any) => ({
              id: row.id,
              name: row.name || row.Nome || row.nome || row.title
            })));
          }
          if (links) {
            userComorbidityIds = links.map((l: any) => l.comorbidity_id);
          }
          // build reverse map
          const reverse: Record<string, string | number> = {};
          Object.entries(comorbidityNameById).forEach(([id, nm]) => {
            if (nm) reverse[nm] = id;
          });
          setComorbidityIdByName(reverse);
        } catch (e) {
          console.error('[ProfileTab] Comorbidities fetch error:', e);
          // keep fallback chronicOptions constant
        }

        // Map to UI state (fallback to current when missing)
        const bloodTypeText = php?.blood_type_id
          ? (bloodTypeLabelById[php.blood_type_id] || healthData.bloodType)
          : healthData.bloodType;
        const organDonor = typeof php?.organ_donor === 'boolean' ? php!.organ_donor : healthData.organDonor;
        const bloodDonor = typeof php?.blood_donor === 'boolean' ? php!.blood_donor : healthData.bloodDonor;
        const allergiesField = php?.allergies;
        const allergies = Array.isArray(allergiesField)
          ? allergiesField
          : (typeof allergiesField === 'string' && allergiesField.trim().length
            ? allergiesField.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
            : healthData.allergies);
        const chronicConditions = userComorbidityIds.length
          ? userComorbidityIds.map((id) => comorbidityNameById[id]).filter(Boolean)
          : healthData.chronicConditions;

        setHealthData((prev) => ({
          ...prev,
          bloodType: bloodTypeText,
          organDonor,
          bloodDonor,
          allergies,
          chronicConditions,
        }));
      } catch (err) {
        // leave mocks in place if anything fails
      }
    };

    loadHealthData();
  }, []);

  // Helpers to persist to DB
  const ensureHealthProfile = async (): Promise<string | number | null> => {
    try {
      if (healthProfileId) return healthProfileId;
      if (!profileId) return null;
      const { data, error } = await supabase
        .from('patient_health_profile')
        .insert({ profile_id: profileId })
        .select('id')
        .single();
      if (error) return null;
      setHealthProfileId(data.id);
      return data.id;
    } catch {
      return null;
    }
  };

  const persistDonorFlag = async (field: 'organ_donor' | 'blood_donor', value: boolean) => {
    const hpId = healthProfileId || (await ensureHealthProfile());
    if (!hpId) return;
    await supabase.from('patient_health_profile').update({ [field]: value }).eq('id', hpId);
  };

  const persistAllergies = async (allergiesArr: string[]) => {
    const hpId = healthProfileId || (await ensureHealthProfile());
    if (!hpId) return;
    // store as TXT (comma-separated)
    const txt = allergiesArr.join(', ');
    await supabase.from('patient_health_profile').update({ allergies: txt }).eq('id', hpId);
  };

  const persistComorbidities = async (names: string[]) => {
    const hpId = healthProfileId || (await ensureHealthProfile());
    if (!hpId) return;
    const ids = names
      .map((n) => comorbidityIdByName[n])
      .filter((v) => v !== undefined && v !== null) as Array<string | number>;
    try {
      await supabase.from('patient_comorbidities').delete().eq('patient_health_profile_id', hpId);
      if (ids.length > 0) {
        const payload = ids.map((cid) => ({ patient_health_profile_id: hpId, comorbidity_id: cid }));
        await supabase.from('patient_comorbidities').insert(payload);
      }
    } catch (e) {
      // ignore for now, UI remains consistent locally
    }
  };

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
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <p className="text-center text-gray-600 mt-2 text-sm">Foto 3×4</p>
              </div>

              {/* Verified Information */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Nome completo</p>
                  <p className="text-gray-900 text-lg">{profileData.fullName}</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">CPF</p>
                  <p className="text-gray-900 text-lg">{maskCPF(profileData.cpf)}</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Data de nascimento</p>
                  <p className="text-gray-900 text-lg">{formatBirthDate(profileData.birthDate)}</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">E-mail cadastrado</p>
                  <p className="text-gray-900 text-lg">{profileData.email}</p>
                </div>
                <div className="bg-white/70 p-4 rounded-xl">
                  <p className="text-gray-600 text-sm mb-1">Sexo</p>
                  <p className="text-gray-900 text-lg">{profileData.gender}</p>
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
                        <span>{formatLastModified(lastModifiedAt)}</span>
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
                        <span>{formatLastModified(lastModifiedAt)}</span>
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
                      onClick={async () => {
                        const next = !healthData.organDonor;
                        setHealthData({ ...healthData, organDonor: next });
                        await persistDonorFlag('organ_donor', next);
                      }}
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
                      onClick={async () => {
                        const next = !healthData.bloodDonor;
                        setHealthData({ ...healthData, bloodDonor: next });
                        await persistDonorFlag('blood_donor', next);
                      }}
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
                        <span>{formatLastModified(lastModifiedAt)}</span>
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
                        {user?.name?.charAt(0) ?? 'U'}
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
                  <p className="text-gray-600 text-sm mb-4">{user?.healthPlan || user?.health_plan}</p>
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
                  <p className="text-gray-600 text-sm">Os médicos poderão ter acesso ao seu prontuário digital</p>
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

      {/* Edit Allergies Modal */}
      <AnimatePresence>
        {isEditingHealth && selectedField === 'allergies' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditingHealth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl text-gray-900 mb-6">Alergias medicamentosas ou alimentares</h3>
              <div className="space-y-3 mb-6">
                {healthData.allergies.map((allergy, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <span className="text-gray-900">{allergy}</span>
                    <button
                      onClick={() => removeAllergy(idx)}
                      className="text-red-600 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={addAllergy}
                variant="outline"
                className="w-full mb-4 border-teal-300 text-teal-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar alergia
              </Button>
              <Button
                onClick={async () => {
                  await persistAllergies(healthData.allergies);
                  handleSaveHealthData();
                }}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white mb-2"
              >
                Salvar
              </Button>
              <Button
                onClick={() => setIsEditingHealth(false)}
                variant="outline"
                className="w-full border-gray-300 text-gray-700"
              >
                Cancelar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Health Data Modal */}
      <AnimatePresence>
        {isEditingHealth && selectedField === 'bloodType' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditingHealth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl text-gray-900 mb-6">Tipo sanguíneo e fator RH</h3>
              <div className="space-y-3 mb-8">
                {bloodTypeOptions.length > 0 ? (
                  bloodTypeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={async () => {
                        setHealthData({ ...healthData, bloodType: option.label });
                        const hpId = healthProfileId || (await ensureHealthProfile());
                        if (hpId) {
                          await supabase.from('patient_health_profile').update({ blood_type_id: option.id }).eq('id', hpId);
                        }
                        handleSaveHealthData();
                      }}
                      className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-colors ${
                        healthData.bloodType === option.label
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <p className="text-gray-900 text-lg">{option.label}</p>
                    </button>
                  ))
                ) : (
                  // Fallback to hardcoded list if fetch failed
                  ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Não sei'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setHealthData({ ...healthData, bloodType: type });
                        handleSaveHealthData();
                      }}
                      className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-colors ${
                        healthData.bloodType === type
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <p className="text-gray-900 text-lg">{type}</p>
                    </button>
                  ))
                )}
              </div>
              <Button
                onClick={() => setIsEditingHealth(false)}
                variant="outline"
                className="w-full border-gray-300 text-gray-700"
              >
                Cancelar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Chronic Conditions Modal */}
      <AnimatePresence>
        {isEditingHealth && selectedField === 'chronicConditions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditingHealth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl text-gray-900 mb-6">Condições crônicas ou doenças importantes</h3>
              <div className="space-y-3 mb-8">
                {allComorbidityOptions.length > 0 ? (
                  allComorbidityOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={healthData.chronicConditions.includes(option.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const next = [...healthData.chronicConditions, option.name];
                            setHealthData({ ...healthData, chronicConditions: next });
                          } else {
                            const next = healthData.chronicConditions.filter(c => c !== option.name);
                            setHealthData({ ...healthData, chronicConditions: next });
                          }
                        }}
                        className="w-5 h-5 rounded accent-teal-600"
                      />
                      <span className="text-gray-900 text-lg">{option.name}</span>
                    </label>
                  ))
                ) : (
                  // Fallback to hardcoded list if fetch failed
                  ['Diabetes', 'Hipertensão', 'Asma', 'Epilepsia', 'Cardiopatia', 'Obesidade', 'Câncer', 'HIV', 'Hepatite', 'Doença renal crônica'].map((condition) => (
                    <label key={condition} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={healthData.chronicConditions.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const next = [...healthData.chronicConditions, condition];
                            setHealthData({ ...healthData, chronicConditions: next });
                          } else {
                            const next = healthData.chronicConditions.filter(c => c !== condition);
                            setHealthData({ ...healthData, chronicConditions: next });
                          }
                        }}
                        className="w-5 h-5 rounded accent-teal-600"
                      />
                      <span className="text-gray-900 text-lg">{condition}</span>
                    </label>
                  ))
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={async () => {
                    await persistComorbidities(healthData.chronicConditions);
                    handleSaveHealthData();
                  }}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                >
                  Salvar
                </Button>
                <Button
                  onClick={() => setIsEditingHealth(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700"
                >
                  Cancelar
                </Button>
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