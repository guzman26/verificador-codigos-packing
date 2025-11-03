# 📦 Verificador de Códigos - Lomas Altas

Sistema de verificación y validación de códigos de cajas para operarios.

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📱 Rutas

- `/` - Terminal de Control (Dashboard principal)
- `/validate-code` - Validador de Códigos de Cajas
- `/create-pallet` - Crear Nuevo Pallet

## ✨ Características

### 🔍 Validador de Códigos
- Validación de códigos de 16 dígitos
- Detección de errores (día 9, calibre 23, dígitos extra, etc.)
- Feedback visual (verde/rojo) y auditivo
- Mensajes de ayuda contextuales

### 📊 Dashboard
- Vista en tiempo real de cajas y pallets
- Estadísticas en el header
- Terminal de control centralizado

### 📦 Gestión de Pallets
- Creación de pallets
- Asignación automática de cajas

## 🔧 Validador de Códigos

El código es autodescriptivo:

- `src/utils/boxCodeValidator.ts` - Funciones de validación
- `src/views/CodeValidator/CodeValidator.tsx` - Interfaz de usuario

### Ejemplos

```
4272516302111001       ✅ VÁLIDO
9272516302111001       ❌ Día 9 inválido (solo 1-7)
4272516312311001       ❌ Calibre 23 NO EXISTE
42725163021110012345   ❌ Dígitos extra
```

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite
- React Router
- Lucide React (iconos)

## 📂 Estructura

```
src/
├── components/     # Componentes reutilizables
├── hooks/          # Custom hooks
├── services/       # API services
├── utils/          # Utilidades (validación, etc.)
└── views/          # Vistas principales
```

## 🔨 Build

```bash
npm run build
npm run preview
```

---

**Nota**: El código está diseñado para ser autodescriptivo. Las funciones de validación tienen nombres claros y cada una maneja un aspecto específico (día, calibre, turno, etc.).
