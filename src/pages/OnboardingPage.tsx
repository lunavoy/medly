import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Heart, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useOnboarding } from '../hooks/useOnboarding'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { loading, saving, isComplete, formData, setFormData, saveData } = useOnboarding()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Se onboarding já foi completado, ir direto para dashboard
  if (isComplete && !formData.cpf) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleSave = async () => {
    if (!formData.fullName || !formData.cpf) {
      toast.error('Por favor, preencha pelo menos Nome e CPF')
      return
    }

    const success = await saveData()
    if (success) {
      toast.success('Dados salvos com sucesso!')
      setTimeout(() => navigate('/dashboard'), 1000)
    } else {
      toast.error('Erro ao salvar dados')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Med.ly</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bem-vindo!</h2>
          <p className="text-gray-600">Precisamos de alguns dados para personalizar sua experiência</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-teal-200 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                        placeholder="João Silva"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                        placeholder="123.456.789-00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sexo
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      >
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Health Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Informações de Saúde</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo Sanguíneo
                      </label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      >
                        <option value="">Selecione</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alergias Medicamentosas/Alimentares
                      </label>
                      <input
                        type="text"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                        placeholder="Ex: Penicilina, Dipirona"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condições Crônicas
                      </label>
                      <input
                        type="text"
                        value={formData.chronicConditions}
                        onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                        placeholder="Ex: Hipertensão, Diabetes"
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="mt-6 space-y-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
                      <input
                        type="checkbox"
                        checked={formData.organDonor}
                        onChange={(e) => setFormData({ ...formData, organDonor: e.target.checked })}
                        className="w-5 h-5 rounded accent-teal-600"
                      />
                      <span className="text-gray-900">Sou doador de órgãos</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50">
                      <input
                        type="checkbox"
                        checked={formData.bloodDonor}
                        onChange={(e) => setFormData({ ...formData, bloodDonor: e.target.checked })}
                        className="w-5 h-5 rounded accent-teal-600"
                      />
                      <span className="text-gray-900">Posso doar sangue</span>
                    </label>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Esses dados serão utilizados para personalizar sua experiência e, em caso de emergência, serão acessíveis aos profissionais de saúde autorizados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mt-8 justify-center"
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 text-lg"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Salvar Dados
              </>
            )}
          </Button>

          <Button
            onClick={() => navigate('/dashboard')}
            disabled={saving}
            variant="outline"
            className="border-teal-300 text-teal-700 px-8 py-3 text-lg"
          >
            Pular por enquanto
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
