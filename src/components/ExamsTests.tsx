import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  Filter,
  Camera,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  RotateCw,
  Crop,
  Sun,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
  FolderOpen,
  Scan,
  Plus,
  Mic,
  FileImage,
  Loader
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Exam {
  id: number;
  name: string;
  type: 'Laboratorial' | 'Imagem' | 'Cardiológico' | 'Outro';
  date: string;
  clinic: string;
  doctor: string;
  viewed: boolean;
  fileType: 'pdf' | 'image';
  thumbnail?: string;
}

export function ExamsTests() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadFlow, setUploadFlow] = useState<'closed' | 'source' | 'preview' | 'confirm' | 'success'>('closed');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [filterYear, setFilterYear] = useState<string>('Todos');
  const [filterType, setFilterType] = useState<string>('Todos');
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Upload flow state
  const [uploadData, setUploadData] = useState({
    name: '',
    date: '',
    type: 'Laboratorial' as Exam['type'],
    shareWithDoctor: true
  });

  const mockExams: Exam[] = [
    {
      id: 1,
      name: 'Ecocardiograma com Doppler',
      type: 'Cardiológico',
      date: '2025-12-10',
      clinic: 'PJ Alves Cardiologia',
      doctor: 'Dr. Paulo Juvenal Alves',
      viewed: false,
      fileType: 'pdf'
    },
    {
      id: 2,
      name: 'Hemograma Completo',
      type: 'Laboratorial',
      date: '2025-12-08',
      clinic: 'Laboratório São Lucas',
      doctor: 'Dra. Ana Silva',
      viewed: true,
      fileType: 'pdf'
    },
    {
      id: 3,
      name: 'Raio-X de Tórax',
      type: 'Imagem',
      date: '2025-12-05',
      clinic: 'Clínica de Imagem Diagnóstica',
      doctor: 'Dr. Carlos Mendes',
      viewed: true,
      fileType: 'image'
    },
    {
      id: 4,
      name: 'Ultrassom Abdominal',
      type: 'Imagem',
      date: '2025-11-28',
      clinic: 'Hospital Santa Clara',
      doctor: 'Dra. Maria Santos',
      viewed: true,
      fileType: 'image'
    },
    {
      id: 5,
      name: 'Glicemia em Jejum',
      type: 'Laboratorial',
      date: '2025-11-20',
      clinic: 'Laboratório São Lucas',
      doctor: 'Dra. Ana Silva',
      viewed: true,
      fileType: 'pdf'
    },
    {
      id: 6,
      name: 'Eletrocardiograma',
      type: 'Cardiológico',
      date: '2025-11-15',
      clinic: 'PJ Alves Cardiologia',
      doctor: 'Dr. Paulo Juvenal Alves',
      viewed: true,
      fileType: 'pdf'
    }
  ];

  const [exams, setExams] = useState(mockExams);

  // Filter exams
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'Todos' || exam.date.startsWith(filterYear);
    const matchesType = filterType === 'Todos' || exam.type === filterType;
    return matchesSearch && matchesYear && matchesType;
  });

  // Group by month
  const groupedExams = filteredExams.reduce((acc, exam) => {
    const date = new Date(exam.date);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(exam);
    return acc;
  }, {} as Record<string, Exam[]>);

  const recentExams = exams.slice(0, 6);

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    setViewerOpen(true);
    // Mark as viewed
    setExams(exams.map(e => e.id === exam.id ? { ...e, viewed: true } : e));
  };

  const handleUploadStart = (source: 'camera' | 'gallery' | 'scan') => {
    toast.success(`Abrindo ${source === 'camera' ? 'câmera' : source === 'gallery' ? 'galeria' : 'scanner'}...`);
    setUploadFlow('preview');
  };

  const handleUploadConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUploadFlow('success');
    }, 1500);
  };

  const handleUploadComplete = () => {
    // Add new exam
    const newExam: Exam = {
      id: exams.length + 1,
      name: uploadData.name,
      type: uploadData.type,
      date: uploadData.date,
      clinic: 'Upload Manual',
      doctor: 'Você',
      viewed: false,
      fileType: 'pdf'
    };
    setExams([newExam, ...exams]);
    setUploadFlow('closed');
    setUploadData({ name: '', date: '', type: 'Laboratorial', shareWithDoctor: true });
    toast.success('Exame adicionado com sucesso!');
  };

  const suggestedExams = [
    'Ecocardiograma',
    'Hemograma Completo',
    'Glicemia em Jejum',
    'Raio-X',
    'Ultrassom',
    'Eletrocardiograma',
    'Colesterol Total',
    'Ureia e Creatinina'
  ];

  return (
    <div className="relative min-h-screen pb-24">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-teal-100 shadow-sm mb-6 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-3xl text-gray-900">Meus Exames e Resultados</h1>
          <Button
            onClick={() => setSearchOpen(true)}
            variant="outline"
            className="border-teal-300 text-teal-700"
            size="lg"
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Section 1 - Recent Exams */}
        <div>
          <h2 className="text-2xl text-gray-900 mb-6">Exames recentes</h2>
          
          {recentExams.length === 0 ? (
            <Card className="border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <FolderOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl text-gray-900 mb-3">Nenhum exame recente</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Comece adicionando seus exames e resultados
                </p>
                <Button
                  onClick={() => setUploadFlow('source')}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-lg px-8 py-6"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Adicionar meu primeiro exame
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="border-2 border-teal-100 cursor-pointer hover:border-teal-300 transition-colors h-full"
                    onClick={() => handleViewExam(exam)}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                          exam.fileType === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {exam.fileType === 'pdf' ? (
                            <FileText className={`w-8 h-8 ${exam.fileType === 'pdf' ? 'text-red-600' : 'text-blue-600'}`} />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-blue-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl text-gray-900 line-clamp-2">{exam.name}</h3>
                            {!exam.viewed && (
                              <Badge className="bg-teal-100 text-teal-700 ml-2">Novo</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            Realizado em {new Date(exam.date).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-gray-700">
                            {exam.clinic} – {exam.doctor}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <Badge variant="outline" className="text-sm">
                              {exam.fileType === 'pdf' ? 'PDF' : 'Imagem'}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                              {exam.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2 - Complete History */}
        {exams.length > 0 && (
          <div>
            <h2 className="text-2xl text-gray-900 mb-6">Todos os exames</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {['Todos', '2025', '2024'].map((year) => (
                <button
                  key={year}
                  onClick={() => setFilterYear(year)}
                  className={`px-6 py-3 rounded-full text-lg transition-all ${
                    filterYear === year
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-300'
                  }`}
                >
                  {year}
                </button>
              ))}
              {['Cardiológicos', 'Laboratoriais', 'Imagens'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === 'Cardiológicos' ? 'Cardiológico' : type === 'Laboratoriais' ? 'Laboratorial' : 'Imagem')}
                  className={`px-6 py-3 rounded-full text-lg transition-all ${
                    (type === 'Cardiológicos' && filterType === 'Cardiológico') ||
                    (type === 'Laboratoriais' && filterType === 'Laboratorial') ||
                    (type === 'Imagens' && filterType === 'Imagem')
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Grouped List */}
            <div className="space-y-4">
              {Object.entries(groupedExams).map(([monthYear, monthExams]) => (
                <Card key={monthYear} className="border-2 border-gray-200">
                  <CardContent className="p-0">
                    {/* Month Header */}
                    <button
                      onClick={() => setExpandedMonth(expandedMonth === monthYear ? null : monthYear)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-xl text-gray-900 capitalize">{monthYear}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-lg">{monthExams.length} exame{monthExams.length !== 1 ? 's' : ''}</span>
                        {expandedMonth === monthYear ? (
                          <ChevronUp className="w-6 h-6 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Exams */}
                    <AnimatePresence>
                      {expandedMonth === monthYear && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-200 overflow-hidden"
                        >
                          {monthExams.map((exam) => (
                            <div
                              key={exam.id}
                              className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-teal-50 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    {exam.fileType === 'pdf' ? (
                                      <FileText className="w-5 h-5 text-red-600" />
                                    ) : (
                                      <ImageIcon className="w-5 h-5 text-blue-600" />
                                    )}
                                    <p className="text-lg text-gray-900">{exam.name}</p>
                                  </div>
                                  <p className="text-gray-600">
                                    {new Date(exam.date).toLocaleDateString('pt-BR')} • {exam.clinic}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleViewExam(exam)}
                                    variant="outline"
                                    className="border-teal-300 text-teal-700"
                                  >
                                    <Eye className="w-5 h-5 mr-2" />
                                    Ver completo
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.success('Download iniciado!');
                                    }}
                                    variant="outline"
                                    className="border-blue-300 text-blue-700"
                                  >
                                    <Download className="w-5 h-5" />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.success('Opções de compartilhamento abertas');
                                    }}
                                    variant="outline"
                                    className="border-cyan-300 text-cyan-700"
                                  >
                                    <Share2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Upload Button */}
      <motion.button
        onClick={() => setUploadFlow('source')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 pt-20"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome de exame ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-xl outline-none"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {searchTerm && (
                <div className="space-y-2">
                  {filteredExams.slice(0, 5).map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => {
                        handleViewExam(exam);
                        setSearchOpen(false);
                      }}
                      className="w-full p-4 text-left hover:bg-teal-50 rounded-xl transition-colors"
                    >
                      <p className="text-gray-900 text-lg">{exam.name}</p>
                      <p className="text-gray-600">{new Date(exam.date).toLocaleDateString('pt-BR')}</p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Flow - Source Selection */}
      <AnimatePresence>
        {uploadFlow === 'source' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
            onClick={() => setUploadFlow('closed')}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-3xl md:rounded-3xl p-8 w-full md:max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-900 mb-6">Como deseja adicionar o exame?</h2>
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleUploadStart('camera')}
                  className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-colors flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl text-gray-900 mb-1">Tirar foto do laudo</p>
                    <p className="text-gray-600">Use a câmera para fotografar</p>
                  </div>
                </button>

                <button
                  onClick={() => handleUploadStart('gallery')}
                  className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-colors flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl text-gray-900 mb-1">Escolher da galeria</p>
                    <p className="text-gray-600">Selecione PDF ou imagem</p>
                  </div>
                </button>

                <button
                  onClick={() => handleUploadStart('scan')}
                  className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-colors flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Scan className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl text-gray-900 mb-1">Digitalizar documento</p>
                    <p className="text-gray-600">Scanner com detecção automática</p>
                  </div>
                </button>
              </div>
              <Button
                onClick={() => setUploadFlow('closed')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 py-6 text-lg"
              >
                Cancelar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Flow - Preview & Edit */}
      <AnimatePresence>
        {uploadFlow === 'preview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            <div className="min-h-screen p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Editar e adicionar informações</h2>
                <button onClick={() => setUploadFlow('closed')}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Preview Area */}
              <div className="bg-gray-100 rounded-2xl p-8 mb-6 aspect-[3/4] flex items-center justify-center border-4 border-dashed border-teal-300">
                <FileText className="w-24 h-24 text-gray-400" />
              </div>

              {/* Edit Controls */}
              <div className="flex gap-3 mb-8">
                <Button variant="outline" className="flex-1 border-teal-300 text-teal-700 py-6">
                  <RotateCw className="w-5 h-5 mr-2" />
                  Girar
                </Button>
                <Button variant="outline" className="flex-1 border-teal-300 text-teal-700 py-6">
                  <Crop className="w-5 h-5 mr-2" />
                  Cortar
                </Button>
                <Button variant="outline" className="flex-1 border-teal-300 text-teal-700 py-6">
                  <Sun className="w-5 h-5 mr-2" />
                  Brilho
                </Button>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-3 text-lg">Nome do exame</label>
                  <input
                    type="text"
                    value={uploadData.name}
                    onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-teal-600 outline-none text-lg"
                    placeholder="Digite o nome do exame"
                    list="exam-suggestions"
                  />
                  <datalist id="exam-suggestions">
                    {suggestedExams.map(exam => (
                      <option key={exam} value={exam} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-gray-700 mb-3 text-lg">Data do exame</label>
                  <input
                    type="date"
                    value={uploadData.date}
                    onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-teal-600 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-3 text-lg">Tipo de exame</label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as Exam['type'] })}
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-teal-600 outline-none text-lg bg-white"
                  >
                    <option value="Laboratorial">Laboratorial</option>
                    <option value="Imagem">Imagem</option>
                    <option value="Cardiológico">Cardiológico</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => setUploadFlow('confirm')}
                  disabled={!uploadData.name || !uploadData.date}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-6 text-lg disabled:opacity-50"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Flow - Confirmation */}
      <AnimatePresence>
        {uploadFlow === 'confirm' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setUploadFlow('preview')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-900 mb-6">Confirmar informações</h2>

              {/* Summary Card */}
              <Card className="border-2 border-teal-200 mb-6">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-10 h-10 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900 mb-2">{uploadData.name}</h3>
                      <p className="text-gray-600">
                        {new Date(uploadData.date).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <Badge className="mt-2">{uploadData.type}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* LGPD Notice */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <p className="text-gray-900 text-lg">
                  🔒 Seus exames são criptografados e só você e sua clínica acessam
                </p>
              </div>

              {/* Share Toggle */}
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl mb-6">
                <p className="text-gray-900 text-lg">Liberar automaticamente para Dr. Paulo Juvenal Alves</p>
                <button
                  onClick={() => setUploadData({ ...uploadData, shareWithDoctor: !uploadData.shareWithDoctor })}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    uploadData.shareWithDoctor ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    uploadData.shareWithDoctor ? 'translate-x-8' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleUploadConfirm}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 mr-3 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar exame'
                  )}
                </Button>
                <Button
                  onClick={() => setUploadFlow('preview')}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 py-6 text-lg"
                  disabled={loading}
                >
                  Voltar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Flow - Success */}
      <AnimatePresence>
        {uploadFlow === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-3xl p-12 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-12 h-12 text-green-600" />
              </motion.div>
              <h2 className="text-3xl text-gray-900 mb-3">Exame adicionado com sucesso!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Já aparece na sua lista e foi enviado para análise segura
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    handleUploadComplete();
                    if (exams.length > 0) {
                      handleViewExam(exams[0]);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-6 text-lg"
                >
                  Ver exame agora
                </Button>
                <Button
                  onClick={handleUploadComplete}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 py-6 text-lg"
                >
                  Voltar para exames
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exam Viewer */}
      <AnimatePresence>
        {viewerOpen && selectedExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl text-gray-900 truncate">{selectedExam.name}</h2>
                  <p className="text-gray-600">{new Date(selectedExam.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toast.success('Download iniciado!')}
                    variant="outline"
                    className="border-teal-300 text-teal-700"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar
                  </Button>
                  <button
                    onClick={() => setViewerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Viewer Content */}
            <div className="max-w-5xl mx-auto p-6">
              {selectedExam.fileType === 'pdf' ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((page) => (
                    <div key={page} className="bg-white shadow-lg rounded-xl p-12 border border-gray-200">
                      <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center">
                        <FileText className="w-24 h-24 text-gray-300" />
                      </div>
                      <p className="text-center text-gray-600 mt-4">Página {page}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Zoom Controls */}
                  <div className="flex justify-center gap-4 mb-6">
                    <Button
                      onClick={() => setZoom(Math.max(50, zoom - 25))}
                      variant="outline"
                      size="lg"
                      className="border-teal-300 text-teal-700"
                    >
                      <ZoomOut className="w-6 h-6 mr-2" />
                      Reduzir
                    </Button>
                    <div className="flex items-center px-6 py-3 bg-gray-100 rounded-xl">
                      <span className="text-lg">{zoom}%</span>
                    </div>
                    <Button
                      onClick={() => setZoom(Math.min(200, zoom + 25))}
                      variant="outline"
                      size="lg"
                      className="border-teal-300 text-teal-700"
                    >
                      <ZoomIn className="w-6 h-6 mr-2" />
                      Ampliar
                    </Button>
                    <Button
                      onClick={() => setZoom(100)}
                      variant="outline"
                      size="lg"
                      className="border-teal-300 text-teal-700"
                    >
                      <RotateCcw className="w-6 h-6 mr-2" />
                      Resetar
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center">
                    <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform">
                      <div className="w-[600px] h-[600px] bg-gray-700 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-24 h-24 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="max-w-7xl mx-auto flex gap-4">
                <Button
                  onClick={() => toast.success('Opções de compartilhamento abertas')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 text-lg"
                >
                  <Share2 className="w-6 h-6 mr-3" />
                  Compartilhar com médico
                </Button>
                <Button
                  onClick={() => toast.info('Funcionalidade de anotações será implementada')}
                  variant="outline"
                  className="flex-1 border-teal-300 text-teal-700 py-6 text-lg"
                >
                  <Mic className="w-6 h-6 mr-3" />
                  Adicionar anotação
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Skeleton */}
      {loading && (
        <div className="fixed inset-0 bg-white/90 z-40 flex items-center justify-center">
          <Loader className="w-12 h-12 text-teal-600 animate-spin" />
        </div>
      )}
    </div>
  );
}
