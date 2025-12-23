# Build script for production with API key
# Run this script from the project root directory

# Set the Gemini API key
$env:VITE_GEMINI_API_KEY="API_KEY_REMOVED_FOR_SECURITY"

# Build the project
npm run build

Write-Host "`n✅ Build completado con API key embebida" -ForegroundColor Green
Write-Host "📁 Archivos listos en: dist/" -ForegroundColor Cyan
Write-Host "`nSube el contenido de 'dist' a Hostinger por FTP" -ForegroundColor Yellow
