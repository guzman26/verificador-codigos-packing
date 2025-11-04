# 📦 Verificador de Códigos de Cajas

**Aplicación standalone para validación de códigos de cajas de 16 dígitos**

## 🎯 Propósito

Herramienta **offline** de validación de códigos. NO se conecta a backend ni gestiona inventario. Solo **verifica si un código es válido** según las reglas oficiales.

## ✨ Características

- ✅ Validación **local** de códigos de 16 dígitos
- ✅ Detección de errores específicos
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

## 🔍 Reglas de Validación

| Campo | Posición | Valores Válidos | Descripción |
|-------|----------|-----------------|-------------|
| Día | 0 | 1-7 | 1=Lunes a 7=Domingo |
| Semana | 1-2 | 01-53 | Semana ISO del año |
| Año | 3-4 | YY | Últimos 2 dígitos (ej: 25 = 2025) |
| Operario | 5-6 | 00-99 | Código del operario |
| Empacadora | 7 | 1-9 | Número de máquina (no 0) |
| Turno | 8 | 1, 2, 3 | 1=Mañana, 2=Tarde, 3=Noche |
| **Calibre** | **9-10** | **15 valores** | **Ver tabla abajo** |
| Formato | 11 | 1, 2, 3 | 1=180u, 2=100 JUMBO, 3=Docena |
| Empresa | 12 | 1-5 | Código de empresa |
| Contador | 13-15 | 001-999 | Secuencial (no 000) |

## 🥚 Calibres Válidos (15 valores)

**Blancos (BCO):** 01, 02, 04, 07, 09, 12, 15  
**Color:** 03, 05, 06, 11, 13, 14, 16  
**Especiales:** 08

### ⚠️ Calibres Inválidos Comunes

- `00` - NO existe
- `10` - NO existe (salta del 09 al 11)
- `23` - **NO EXISTE** (error más común)
- `17-22`, `24-99` - NO existen

Ver [CALIBRES.md](./CALIBRES.md) para documentación detallada.

## 📊 Ejemplos

```
✅ VÁLIDO:   4272516302111001
            └─┬─┘ Día 4 (Jueves)
              └─┬─┘ Semana 27
                └─┬─┘ Año 2025
                  └─┬─┘ Operario 16
                    └─┬ Empacadora 3
                      └─┬ Turno 1 (Mañana)
                        └─┬─┘ Calibre 02 (EXTRA BCO) ✓
                          └─┬ Formato 1 (180u)
                            └─┬ Empresa 1
                              └─┬─┬─┘ Caja #001

❌ INVÁLIDO: 9272516302111001  (día 9 no existe)
❌ INVÁLIDO: 4272516312311001  (calibre 23 no existe)
❌ INVÁLIDO: 4272516310111001  (calibre 10 no existe)
❌ INVÁLIDO: 427251630211100   (solo 15 dígitos)
```

## 🛠️ Build para Producción

```bash
npm run build
```

Genera archivos estáticos en `/dist` listos para deploy.

## 📱 Uso

1. Abrir aplicación
2. Escanear código con lector (o ingresar manualmente)
3. Ver resultado instantáneo:
   - 🟢 Verde = Válido
   - 🔴 Rojo = Inválido (con detalles del error)
4. Repetir para siguiente código

## 🔒 Sin Backend

Esta aplicación **NO**:
- ❌ Se conecta a APIs
- ❌ Guarda en base de datos
- ❌ Gestiona inventario
- ❌ Requiere internet

Solo valida códigos localmente en el navegador.

## 📂 Estructura

```
src/
├── constants/
│   └── calibers.ts           # Calibres válidos (fuente única)
├── utils/
│   └── boxCodeValidator.ts   # Lógica de validación
├── views/
│   └── CodeValidator/        # Vista principal
└── config/
    └── constants.ts          # Configuración global
```

## 🧪 Testing Rápido

```bash
# Código válido
4272516302111001

# Errores comunes
9272516302111001  # Día 9
4272516312311001  # Calibre 23
4272516310111001  # Calibre 10
4272516002111001  # Empacadora 0
```

## 🛠️ Tecnologías

- React 18 + TypeScript
- Vite
- Validación 100% local
- Sin dependencias de backend

---

**Nota**: Para gestión completa de inventario con backend, ver `lector-codigos-desktop-packing`.

**Documentación de calibres**: Ver [CALIBRES.md](./CALIBRES.md) para lista completa y detallada.
