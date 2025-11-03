# 📦 Verificador de Códigos de Cajas

**Aplicación standalone para validación de códigos de cajas de 16 dígitos**

## 🎯 Propósito

Esta aplicación es una herramienta **offline** de validación de códigos. NO se conecta a ningún backend ni gestiona inventario. Su único objetivo es **verificar si un código es válido** según las reglas de formato establecidas.

## ✨ Características

- ✅ Validación **local** de códigos de 16 dígitos
- ✅ Detección de errores específicos (día 9, calibre 23, etc.)
- ✅ Feedback visual (verde/rojo) y auditivo
- ✅ Historial de validaciones en sesión
- ✅ Estadísticas en tiempo real
- ✅ Sin conexión a internet requerida

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔍 ¿Qué valida?

El validador verifica que un código de 16 dígitos cumpla con:

| Campo | Posición | Valores Válidos |
|-------|----------|-----------------|
| Día de la semana | 0 | 1-7 |
| Semana del año | 1-2 | 01-53 |
| Año | 3-4 | YY (ej: 25) |
| Operario | 5-6 | 00-99 |
| Empacadora | 7 | 1-9 |
| Turno | 8 | 1, 2, 3 |
| **Calibre** | **9-10** | **01-09, 11-16 (NO 23)** |
| Formato | 11 | 1, 2, 3 |
| Empresa | 12 | 1-5 |
| Contador | 13-15 | 001-999 |

## 📊 Ejemplos

```
✅ VÁLIDO:   4272516302111001
❌ INVÁLIDO: 9272516302111001  (día 9 no existe)
❌ INVÁLIDO: 4272516312311001  (calibre 23 no existe)
❌ INVÁLIDO: 427251630211100   (solo 15 dígitos)
```

## 🛠️ Build para Producción

```bash
npm run build
```

El build genera archivos estáticos en `/dist` que pueden desplegarse en cualquier servidor web.

## 📱 Uso

1. Abrir la aplicación
2. Escanear código con lector de barras (o ingresar manualmente)
3. Ver resultado instantáneo
4. Repetir para siguiente código

## 🔒 Sin Backend

Esta aplicación **NO**:
- ❌ Se conecta a APIs
- ❌ Guarda datos en base de datos
- ❌ Gestiona inventario de cajas/pallets
- ❌ Requiere internet

Solo valida códigos localmente en el navegador.

## 🧪 Testing

Para probar rápidamente:

```bash
# Código válido
4272516302111001

# Día inválido
9272516302111001

# Calibre inválido
4272516312311001
```

## 📂 Estructura

```
src/
├── utils/
│   └── boxCodeValidator.ts    # Lógica de validación (standalone)
├── views/
│   └── CodeValidator/          # Vista principal
└── styles/
    └── theme.ts               # Tema visual
```

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite (build rápido)
- Validación 100% local
- Sin dependencias de backend

---

**Nota**: Para un sistema completo de gestión de inventario con backend, ver el repositorio `lector-codigos-desktop-packing`.
