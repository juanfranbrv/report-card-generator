# Build script for production with API key
# Run this script from the project root directory

# Read API key from .env.local file
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^VITE_GEMINI_API_KEY=(.+)$") {
            $env:VITE_GEMINI_API_KEY = $matches[1]
        }
    }
}
else {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "Create .env.local with: VITE_GEMINI_API_KEY=your_key_here" -ForegroundColor Yellow
    exit 1
}

if (-not $env:VITE_GEMINI_API_KEY) {
    Write-Host "ERROR: VITE_GEMINI_API_KEY not found in .env.local!" -ForegroundColor Red
    exit 1
}

# Build the project
npm run build

Write-Host ""
Write-Host "Build completado con API key embebida" -ForegroundColor Green
Write-Host "Archivos listos en: dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sube el contenido de 'dist' a Hostinger por FTP" -ForegroundColor Yellow
