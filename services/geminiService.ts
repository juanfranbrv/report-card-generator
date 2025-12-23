
import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

export const generateFeedback = async (data: ReportData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Como profesor/a profesional, escribe un comentario de feedback personalizado, constructivo y alentador para el boletín de notas de un estudiante.
    
    DATOS DEL ESTUDIANTE:
    - Nombre: ${data.studentName}
    - Nivel: ${data.courseLevel}
    - Calificaciones (A es excelente, E es insuficiente): 
      * Lectura: ${data.grades.reading || 'No evaluado'}
      * Escritura: ${data.grades.writing || 'No evaluado'}
      * Escucha: ${data.grades.listening || 'No evaluado'}
      * Habla: ${data.grades.speaking || 'No evaluado'}
    
    - Comportamiento y Actitud:
      * Participación: ${data.behaviors.participation === 'happy' ? 'Excelente' : data.behaviors.participation === 'neutral' ? 'Mejorable' : 'Baja'}
      * Hábitos de estudio: ${data.behaviors.learningBehaviors === 'happy' ? 'Muy buenos' : data.behaviors.learningBehaviors === 'neutral' ? 'Aceptables' : 'Necesita mejorar'}
      * Habilidades sociales: ${data.behaviors.socialSkills === 'happy' ? 'Excelentes' : data.behaviors.socialSkills === 'neutral' ? 'Normales' : 'Debe trabajar en ellas'}
      * Trabajo en clase: ${data.behaviors.classWork === 'happy' ? 'Muy constante' : data.behaviors.classWork === 'neutral' ? 'Irregular' : 'Poco productivo'}
    
    REQUISITOS DEL COMENTARIO:
    1. Debe estar en ESPAÑOL.
    2. Debe dirigirse o referirse a ${data.studentName} de forma natural y cálida.
    3. Máximo 3-4 frases.
    4. El tono debe ser profesional pero muy motivador.
    5. Personaliza el contenido basándote específicamente en las notas y actitudes proporcionadas. Si tiene notas bajas, ofrece un consejo específico para mejorar.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "No se pudo generar el comentario. Por favor, inténtelo de nuevo.";
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "Error al conectar con la IA para generar el comentario.";
  }
};
