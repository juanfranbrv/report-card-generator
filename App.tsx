
import React, { useState, useRef } from 'react';
import { ReportData, Rating } from './types';
import ReportCardPreview from './components/ReportCardPreview';
import { generateFeedback } from './services/geminiService';
import { Sparkles, Save, RefreshCw, Info, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const initialData: ReportData = {
  studentName: '',
  teacherName: '',
  courseLevel: '',
  year: '',
  grades: {
    reading: '',
    writing: '',
    listening: '',
    speaking: '',
  },
  behaviors: {
    participation: null,
    learningBehaviors: null,
    socialSkills: null,
    classWork: null,
  },
  comments: '',
};

const GRADE_OPTIONS = ['', 'A', 'B', 'C', 'D', 'E'];

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ReportData] as any),
          [child]: value,
        },
      }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRatingChange = (category: keyof ReportData['behaviors'], rating: Rating) => {
    setData(prev => ({
      ...prev,
      behaviors: {
        ...prev.behaviors,
        [category]: rating,
      },
    }));
  };

  const handleGenerateAI = async () => {
    if (!data.studentName) {
      alert("Por favor, introduce al menos el nombre del alumno.");
      return;
    }
    setIsGenerating(true);
    const feedback = await generateFeedback(data);
    setData(prev => ({ ...prev, comments: feedback }));
    setIsGenerating(false);
  };

  const fillTestData = () => {
    setData({
      studentName: 'María',
      teacherName: 'Estela',
      courseLevel: '5º Primaria',
      year: '2025-2026',
      grades: {
        reading: 'A',
        writing: 'A',
        listening: 'E',
        speaking: 'B',
      },
      behaviors: {
        participation: 'happy',
        learningBehaviors: 'neutral',
        socialSkills: 'happy',
        classWork: 'sad',
      },
      comments: 'María, demuestras un talento excepcional en lectura y escritura, además de poseer unas habilidades sociales admirables que enriquecen mucho la convivencia en el aula. Para alcanzar tu máximo potencial, es fundamental que este próximo trimestre te enfoques en mejorar la escucha activa y la productividad durante las tareas individuales, evitando distracciones. Estoy convencida de que, con un poco más de concentración y una participación más activa, lograrás que tus resultados sean tan brillantes como tu personalidad. ¡Sigue adelante, confío mucho en ti!',
    });
  };

  const handlePrintPDF = () => {
    // Usar la capacidad nativa del navegador para imprimir como PDF
    // Esto preserva exactamente el layout que se ve en la vista previa
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 gap-8">
      {/* Editor Section */}
      <div className="w-full lg:w-1/2 no-print bg-white p-6 rounded-xl shadow-lg h-fit">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Save className="text-blue-600" /> Generador de Reportes
          </h1>
          <button
            onClick={fillTestData}
            className="flex items-center gap-2 text-xs bg-gray-600 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-3 h-3" />
            Datos de Prueba
          </button>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="font-semibold text-gray-700 border-b pb-1">Información General</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500">Nombre del Alumno/a</label>
                <input
                  name="studentName"
                  value={data.studentName}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Ej: Maria"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Nombre del Profesor/a</label>
                <input
                  name="teacherName"
                  value={data.teacherName}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Ej: Estela"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Curso / Nivel</label>
                <input
                  name="courseLevel"
                  value={data.courseLevel}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Ej: 5º Primaria"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Año</label>
                <input
                  name="year"
                  value={data.year}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="2025 - 2026"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-gray-700 border-b pb-1">Calificaciones (A-E)</h2>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(data.grades) as Array<keyof typeof data.grades>).map((gradeKey) => (
                <div key={String(gradeKey)}>
                  <label className="block text-sm text-gray-500 capitalize">
                    {gradeKey === 'reading' ? 'Lectura' :
                      gradeKey === 'writing' ? 'Escritura' :
                        gradeKey === 'listening' ? 'Comprensión Auditiva' : 'Expresión Oral'}
                  </label>
                  <select
                    name={`grades.${String(gradeKey)}`}
                    value={data.grades[gradeKey]}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                  >
                    {GRADE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {opt || 'Seleccionar nota...'}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-gray-700 border-b pb-1">Actitud y Comportamiento</h2>
            <div className="space-y-3">
              {(['participation', 'learningBehaviors', 'socialSkills', 'classWork'] as const).map((cat) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {cat === 'participation' ? 'Participación' :
                      cat === 'learningBehaviors' ? 'Hábitos de estudio' :
                        cat === 'socialSkills' ? 'Habilidades sociales' : 'Trabajo en clase'}
                  </span>
                  <div className="flex gap-4">
                    {(['happy', 'neutral', 'sad'] as Rating[]).map((r) => (
                      <button
                        key={r || 'none'}
                        onClick={() => handleRatingChange(cat, r)}
                        className={`p-2 rounded-full border-2 transition-all hover:scale-110 ${data.behaviors[cat] === r
                          ? 'bg-blue-100 border-blue-600 scale-110'
                          : 'border-transparent grayscale opacity-50'
                          }`}
                      >
                        {r === 'happy' && '😊'}
                        {r === 'neutral' && '😐'}
                        {r === 'sad' && '☹️'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h2 className="font-semibold text-gray-700">Comentarios Personalizados</h2>
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating || !data.studentName}
                className="flex items-center gap-2 text-xs bg-purple-600 text-white px-4 py-1.5 rounded-full hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generar con IA
              </button>
            </div>
            <textarea
              name="comments"
              value={data.comments}
              onChange={handleInputChange}
              rows={6}
              className="w-full border p-3 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Escribe comentarios o usa el botón de IA..."
            />
          </section>

          <div className="space-y-3 pt-4">
            <button
              onClick={handlePrintPDF}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              <Download className="w-6 h-6" /> Imprimir / Guardar como PDF
            </button>
            <p className="text-xs text-gray-500 text-center">Usa Ctrl+P o ⌘+P, luego selecciona "Guardar como PDF"</p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-200 p-8 min-h-screen">
        <div className="h-fit">
          <ReportCardPreview data={data} ref={previewRef} />
        </div>
      </div>
    </div>
  );
};

export default App;
