# 📝 Report Card Generator

Generador de boletas de calificación personalizado con integración de IA para generar comentarios automáticos usando Google Gemini.

## ✨ Características

- 📊 Formulario interactivo para calificaciones y comportamiento
- 🤖 Generación automática de comentarios con IA (Google Gemini)
- 🖨️ Impresión directa a PDF usando funcionalidad nativa del navegador
- 📱 Diseño responsive
- 🎨 Preview en tiempo real del reporte
- 📑 Layout optimizado para una sola página A4
- 🧪 Botón de datos de prueba para testing rápido

## 🚀 Desarrollo Local

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm
- API Key de Google Gemini AI

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/juanfranbrv/report-card-generator.git
cd report-card-generator
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar API Key:**

Crea un archivo `.env.local` en la raíz del proyecto:
```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

> [!TIP]
> Obtén tu API key gratis en [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Ejecutar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 🏗️ Build para Producción

### Opción 1: Build Script (Recomendado)

Ejecuta el script PowerShell incluido:
```powershell
.\build-production.ps1
```

### Opción 2: Manual

En PowerShell:
```powershell
$env:VITE_GEMINI_API_KEY="tu_api_key_aqui"; npm run build
```

En Linux/Mac:
```bash
VITE_GEMINI_API_KEY=tu_api_key_aqui npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🌐 Despliegue a Hostinger

1. **Generar build de producción** (ver sección anterior)

2. **Conectar por FTP:**
   - Host: `ftp.tudominio.com`
   - Usuario: Tu usuario FTP
   - Puerto: 21

3. **Subir archivos:**
   
   Sube TODO el contenido de la carpeta `dist/` a `/public_html/`
   
   **Estructura final:**
   ```
   /public_html/
   ├── index.html
   ├── logoweb1.png
   └── assets/
       └── index-[hash].js
   ```

> [!IMPORTANT]
> Sube el **contenido** de `dist`, NO la carpeta `dist` en sí misma

4. **Verificar:**
   Abre `https://tudominio.com/` y verifica que todo funcione

## 📋 Uso de la Aplicación

1. **Llenar datos del estudiante:**
   - Nombre, profesor, curso/nivel, año
   - Calificaciones (A-E)
   - Comportamientos (emojis)

2. **Generar comentario (opcional):**
   - Click en "Generar con IA"
   - La IA creará un comentario personalizado basado en los datos

3. **Imprimir/Guardar PDF:**
   - Click en "Imprimir / Guardar como PDF"
   - En el diálogo:
     - Destino: "Guardar como PDF"
     - Layout: Vertical
   - Guardar

## 🔧 Tecnologías

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (vía CDN)
- **IA:** Google Gemini API
- **PDF:** window.print() nativo del navegador
- **Icons:** Lucide React

## 📁 Estructura del Proyecto

```
report-card-generator/
├── src/
│   ├── App.tsx              # Componente principal
│   ├── components/
│   │   └── ReportCardPreview.tsx  # Vista previa del reporte
│   ├── services/
│   │   └── geminiService.ts       # Integración con Gemini API
│   └── types.ts             # Definiciones TypeScript
├── public/
│   └── logoweb1.png         # Logo del centro educativo
├── index.html               # HTML principal + CSS de impresión
├── build-production.ps1     # Script de build con API key
└── package.json
```

## 🎨 Personalización

### Logo

Reemplaza `public/logoweb1.png` con tu logo y reconstruye:
```bash
npm run build
```

### Estilos de Impresión

Los estilos específicos para impresión están en `index.html` dentro del bloque:
```html
<style>
  @media print {
    /* Estilos de impresión aquí */
  }
</style>
```

**Configuración actual:**
- Tamaño de fuente: 20px (base)
- Padding: 3mm superior, 7mm lateral
- Máximo tamaño que cabe en 1 página A4

## 🔐 Seguridad de la API Key

> [!WARNING]
> La API key se embebe en el bundle de JavaScript y es **visible en el código del navegador**

**Medidas de seguridad recomendadas:**

1. **Configurar restricciones en Google AI Studio:**
   - Limitar por dominio (solo tu dominio de Hostinger)
   - Configurar cuotas de uso

2. **Rotar la key periódicamente**

3. **Para producción seria, considera implementar un backend proxy:**
   ```
   Frontend → Tu Backend → Gemini API
   ```

## 🧪 Testing

Usa el botón "Datos de Prueba" para llenar el formulario automáticamente con datos de ejemplo.

## 📄 Licencia

Este proyecto fue creado por **juanfranbrv with ❤️**

## 🔗 Enlaces

- **Repositorio:** https://github.com/juanfranbrv/report-card-generator
- **Google AI Studio:** https://aistudio.google.com/
- **Hostinger:** https://www.hostinger.com/

## 🐛 Troubleshooting

### "VITE_GEMINI_API_KEY no está configurada"

**Causa:** La API key no se inyectó durante el build

**Solución:** 
```powershell
# Asegúrate de usar el prefijo VITE_
$env:VITE_GEMINI_API_KEY="tu_key"; npm run build
```

### El PDF se genera en 2 páginas

**Causa:** Demasiado texto en comentarios

**Solución:** Reduce el texto o ajusta los tamaños de fuente en `index.html` (sección `@media print`)

### La IA no genera comentarios en producción

**Causa:** La API key no está embebida o es incorrecta

**Solución:** Verifica que el build se hizo con la variable de entorno correcta

## 📝 Changelog

### v1.0.0 (2025-12-23)

- ✅ Implementación inicial con window.print()
- ✅ Integración con Google Gemini AI
- ✅ Logo personalizado
- ✅ Layout optimizado de 1 página
- ✅ Botón de datos de prueba
- ✅ Build script de producción
- ✅ Documentación completa
