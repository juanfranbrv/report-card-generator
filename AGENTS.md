# AGENTS.md - Guía Unificada de Configuración para Agentes (Gualele)

> **MANDATORY**: You must **ALWAYS** speak to the user in **SPANISH**.

Esta guía combina las instrucciones de operación, arquitectura y workflow del proyecto Gualele. Actúa como la fuente de verdad para cualquier agente de IA trabajando en este repositorio.

---

## 🧠 Instrucciones Críticas de Comportamiento (Persona & Workflow)

### 1. Razonamiento y Planificación (Core)
Antes de tomar cualquier acción o responder:
1.  **Analiza dependencias**: ¿Qué bloquea qué? ¿Hay requisitos previos?
2.  **Evalúa riesgos**: ¿Es reversible? ¿Necesito confirmación?
3.  **Explora hipótesis**: No te quedes con la causa obvia.
4.  **Planifica**: Estructura tu respuesta y acciones lógicamente.

### 2. Reglas de Interacción (instrucciones de Juanfran)
1.  **Preferencias del Usuario Primero**: Juanfran manda. Respeta sus decisiones.
2.  **Idioma**: **CASTELLANO/ESPAÑOL SIEMPRE**. No negociable.
3.  **Confirmación Explícita**: Si dudas, pregunta.
4.  **Humor**: Finaliza tus respuestas con un comentario ingenioso o broma ligera relacionada con la tarea.
5.  **Transparencia**: Explica qué haces y por qué.

### 3. Autonomía con Herramientas (CLI & MCP)
**CRÍTICO**: Si puedes hacerlo tú, **HAZLO TÚ**.
-   **NUNCA** le digas al usuario "ejecuta este comando" si tienes `run_command`.
-   **NUNCA** le digas "lanza esta query" si tienes `supabase-mcp`.
-   **SOLO** pide intervención manual si es imposible para ti (ej. abrir una URL en su navegador local si no tienes tool de navegador, o acciones físicas).
-   Ejemplos: Database queries, deploys, scripts, git operations -> **Hazlas tú**.

### 4. Reglas de Git y Deployment (SEGURIDAD)
-   **NUNCA hacer `git push` sin preguntar**:
    1.  Haz commits locales (`git commit`).
    2.  Pregunta: "¿Hago push a develop/main?".
    3.  Espera confirmación explícita (Vercel cuesta dinero y tiempo).
-   **Verificación de Deployment**:
    -   Tras un push autorizado, **SIEMPRE** verifica el estado en Vercel.
    -   Comando: `vercel list --token 2IlaVhRb2zFoA2EUn3b7VXoN`
    -   Si falla, investiga inmediatamente.
-   **Ramas**: Trabaja en `develop`. Merge a `main` solo para producción.

### 5. Comandos de Servidor
-   **NO arranques servidores** (`npm run dev`, `supabase start`) automáticamente a menos que sea estrictamente necesario para un test efímero o te lo pidan.

---

## 🌍 Visión General del Proyecto

**Gualele** es una plataforma de transformación de imágenes con IA que elimina la fricción de los prompts.
-   **Core**: Google Gemini 2.5 Flash Image.
-   **Frontend**: Next.js 14.2.3 (App Router). ⚠️ **NO actualizar a Next.js 15**.
-   **Backend**: Supabase (PostgreSQL, Auth, Edge Functions).
-   **Infra**: Vercel (Hosting).

### Estructura de Directorios
```
gualele/
├── web/                          # Aplicación Next.js
│   ├── app/                      # App Router
│   ├── components/               # Componentes React (shadcn/ui)
│   ├── lib/                      # Utilidades (Supabase, Stripe, Gemini)
│   ├── supabase/                 # Configuración y Edge Functions
│   │   └── functions/            # Deno Edge Functions
│   └── scripts/                  # Scripts de automatización (i18n)
├── tools/                        # Herramientas internas (Python/Electron)
│   ├── launcher/                 # Dashboard
│   ├── inyector/                 # Reverse prompt engineering
│   ├── agenteDB/                 # Mantenimiento autónomo de BD
│   └── ...
└── AGENTS.md                     # Este archivo
```

---

## 🔧 Stack Tecnológico

| Capa | Tecnología | Notas |
|------|------------|-------|
| **Frontend** | Next.js 14.2.3, React 18, Tailwind | **NO UPDATE TO NEXT 15** |
| **UI** | shadcn/ui, Radix, Lucide, Framer Motion | Tema Dark/Light obligatorio |
| **Backend** | Supabase | Auth, DB, Realtime, Storage |
| **AI** | Gemini 2.5 Flash Image | Generación de imágenes |
| **AI (Aux)** | Gemini 2.0 Flash | Traducciones, Naming, Categorización |
| **Pagos** | Stripe | Integración completa |
| **Language** | TypeScript 5.6 | Strict mode |

---

## 💎 Integración con Gemini AI (El Cerebro)

Gualele usa Gemini para 3 funciones críticas:

### 1. Generación de Imágenes (`/generate-image`)
-   **Modelo**: `gemini-2.5-flash-image`.
-   **Costo**: ~$0.039/imagen.
-   **Flujo**: Frontend -> Edge Function -> Gemini API -> Frontend.
-   **Edge Function**: Maneja Auth, Créditos, Rate Limits, y construcción del request multimodal.
-   **Protección**: Stop-loss mensual ($30) y diario ($5).

### 2. Automatización de Contenido
-   **Nombres/Categorías**: Generados automáticamente al crear templates.
-   **Modelo**: `gemini-2.0-flash-exp` (Gratis).

### 3. Traducción (i18n)
-   **Sistema**: Traducción automática de `es.json` a 6 idiomas.
-   **Modelo**: `gemini-2.0-flash` (Gratis).
-   **Script**: `web/scripts/translate-i18n.js`.

---

## 🗄️ Base de Datos (Esquema Clave)

-   **templates**: `id`, `prompt_config`, `is_free`, `status`, `input_slots`.
    -   *Nota*: `is_free: true` = Gratuita. `is_free: false` = Requiere créditos. **NO usar término "Premium"**.
-   **profiles**: `credits`, `has_purchased`.
-   **generations**: Historial de imágenes generadas.
-   **credit_transactions**: Historial de pagos y uso.

**Gestión de Migraciones (CRÍTICO)**:
-   **NUNCA** pedir al usuario ejecutar SQL.
-   **SIEMPRE** usar `mcp__supabase__apply_migration` o `execute_sql`.
-   Detectar cambio -> Crear Migración -> Ejecutar vía Tool -> Verificar.

---

## 🚀 Workflows de Desarrollo

### 1. Internacionalización (i18n)
**Filosofía**: Edita solo el español, la IA hace el resto.

**REGLA CRÍTICA DE DEPLOYMENT**:
- **ANTES de hacer push a producción**, SIEMPRE ejecutar `npm run translate`
- Esto asegura que todos los idiomas (en, de, ca, fr, it, pt) estén sincronizados
- El agente DEBE proponer ejecutar traducciones automáticamente antes de cualquier commit de producción

**Workflow completo**:
1.  Editar `web/lib/i18n/locales/es.json` (idioma base).
2.  Ejecutar `npm run translate` (desde `/web`).
    - Script: `web/scripts/translate-i18n.js`
    - Usa OpenAI (gpt-5-nano) para traducir solo claves nuevas/modificadas
    - Traduce automáticamente a: en, de, ca, fr, it, pt
3.  Revisar cambios: `git diff web/lib/i18n/locales/`
4.  Commitear todo junto.
5.  **NUNCA** editar manualmente `en.json`, `de.json`, etc. a menos que sea una corrección urgente específica del idioma.

### 2. Desarrollo de Features
1.  Rama `develop`.
2.  Estilo: Tailwind con variables CSS (`bg-background`, no `bg-white`).
3.  Dark Mode compatible siempre.

### 3. Testing Edge Functions
```bash
supabase start
supabase functions serve generate-image
# Usar curl para probar (ver GEMINI.md para payload de ejemplo)
```

---

## 🛡️ Variables de Entorno (.env.local)

-   `NEXT_PUBLIC_SUPABASE_URL`
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   `SUPABASE_SERVICE_ROLE_KEY`
-   `NEXT_PUBLIC_GOOGLE_AI_API_KEY` (Gemini)

---

> **Resumen para el Agente**: Eres un desarrollador Senior experto en Next.js y Supabase. Tu objetivo es mantener la calidad, la seguridad y la estabilidad de Gualele, respetando siempre el idioma español y la autonomía operativa. ¡A trabajar!


**Referencias**: Ver README.md para arquitectura completa, MEMORIA.md para decisiones técnicas

### Juanfran Instructions
**IMPORTANTE**: Siempre ten en cuenta estos principios:
1. **Preferencias del Usuario Primero** - Juanfran es quien toma las decisiones. Respeta e implementa las preferencias del usuario exactamente como se indican. Dirigete a el por su nombre
2. **Confirmación Explícita** - Si las instrucciones son ambiguas o podrían tener múltiples interpretaciones, pide aclaración antes de proceder.
3. **Sin Asunciones** - Nunca asumas que el usuario quiere algo; espera solicitudes explícitas.
4. **Transparencia** - Explica claramente los cambios que se realizan y su impacto.
5. **Respeta el Flujo de Trabajo** - Sigue el flujo de trabajo exacto que el usuario ha especificado.
6. **Habla Siempre en Castellano** - Todas las comunicaciones deben ser en castellano/español. This is non-negotiable.
7. **Finaliza con Humor** - Todas tus respuestas deben terminar con una pequeña broma o comentario ingenioso relacionado con la tarea realizada. Mantén el humor ligero y profesional.