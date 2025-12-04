# Actualización de Formatos de Productos

## Resumen de Cambios

El sistema ahora soporta **6 formatos** de productos en lugar de solo 3. Los códigos de 16 dígitos ahora pueden representar tanto **cajas** como **carros**.

## Nuevos Formatos

### Formatos de Cajas (1-3) - Existentes
- **Formato 1**: Caja 180 unidades
- **Formato 2**: Caja 100 JUMBO
- **Formato 3**: Caja Docena

### Formatos de Carros (4-6) - NUEVOS ✨
- **Formato 4**: Carro con bandejas de 20u (2400 huevos, 120 bandejas)
- **Formato 5**: Carro con bandejas de 30u (5400 huevos, 180 bandejas)
- **Formato 6**: Carro formato especial

## Archivos Actualizados

### 1. Validador de Códigos
**Archivo**: `src/utils/boxCodeValidator.ts`
- ✅ Actualizado para aceptar formatos 1-6
- ✅ Validación de combinaciones calibre-formato para carros
- ✅ Mensajes de error actualizados con información de carros
- ✅ Nombres de formatos actualizados en `FORMAT_NAMES`

### 2. Opciones de Formularios
**Archivo**: `src/utils/options.ts`
- ✅ `FORMATO_OPTIONS` actualizado con los 6 formatos
- ✅ Etiquetas descriptivas para cada formato

### 3. Constantes del Sistema
**Archivo**: `src/config/constants.ts`
- ✅ `FORMATS` expandido con `CART_TRAY_20`, `CART_TRAY_30`, `CART_SPECIAL`
- ✅ `VALIDATION_RULES.FORMAT_COUNT` actualizado de 3 a 6

### 4. Vista de Validación
**Archivo**: `src/views/CodeValidator/CodeValidator.tsx`
- ✅ Título actualizado a "Validador de Códigos de Productos"
- ✅ Tarjeta de reglas actualizada para mostrar formatos 1-6

### 5. Documentación
**Archivo**: `README.md`
- ✅ Título actualizado a "Verificador de Códigos de Productos"
- ✅ Nueva sección de formatos con descripción de cajas y carros
- ✅ Tabla de validación actualizada

## Validación de Formatos

### Reglas de Validación
```typescript
// Formatos válidos: 1, 2, 3, 4, 5, 6
if (!['1', '2', '3', '4', '5', '6'].includes(format)) {
  // Error: Formato inválido
}
```

### Combinaciones Especiales
- **Calibres JUMBO (12, 14)** con formato 1 → ❌ Error (solo pueden usar formato 2 en cajas)
- **Calibres JUMBO** con formatos de carro (4-6) → ⚠️ Advertencia (verificar que sea correcto)

## Estructura del Código de 16 Dígitos

```
Posición  | Campo      | Valores        | Descripción
----------|------------|----------------|---------------------------
0         | Día        | 1-7            | Día de la semana
1-2       | Semana     | 01-53          | Semana ISO del año
3-4       | Año        | YY             | Últimos 2 dígitos del año
5-6       | Operario   | 00-99          | Código del operario
7         | Empacadora | 1-9            | Número de máquina
8         | Turno      | 1, 2, 3        | Turno de trabajo
9-10      | Calibre    | 15 valores     | Calibre del huevo
11        | Formato    | 1-6 ⭐ NUEVO   | Tipo de producto
12        | Empresa    | 1-5            | Código de empresa
13-15     | Contador   | 001-999        | Número secuencial
```

## Ejemplos de Códigos Válidos

### Cajas
```
✅ 4272516302111001  - Caja 180u, Calibre EXTRA BCO
✅ 4272516312211001  - Caja 100 JUMBO, Calibre JUMBO BCO
✅ 4272516302311001  - Caja Docena, Calibre EXTRA BCO
```

### Carros (NUEVOS)
```
✅ 4272516302411001  - Carro Bandejas 20u, Calibre EXTRA BCO
✅ 4272516302511001  - Carro Bandejas 30u, Calibre EXTRA BCO
✅ 4272516302611001  - Carro Especial, Calibre EXTRA BCO
```

## Compatibilidad con Backend

El backend (LambdaLomasAltas) ya soporta estos formatos:
- ✅ `config/productFormats.js` - Define los 6 formatos
- ✅ `config/codeSchema.js` - Detecta automáticamente tipo de producto (BOX/CART)
- ✅ `config/schemas/cart.js` - Schema unificado de 16 dígitos para carros

## Testing

Para probar los nuevos formatos:

1. **Formato 4 (Carro 20u)**:
   ```
   4272516302411001
   ```

2. **Formato 5 (Carro 30u)**:
   ```
   4272516302511001
   ```

3. **Formato 6 (Carro Especial)**:
   ```
   4272516302611001
   ```

## Notas Importantes

- ⚠️ Todos los códigos siguen siendo de **16 dígitos**
- ⚠️ La diferencia entre caja y carro está en el **campo formato (posición 11)**
- ⚠️ Los carros usan la misma estructura que las cajas (incluyen operario y empacadora)
- ✅ El validador acepta todos los formatos automáticamente
- ✅ El formulario de creación de pallets incluye todos los formatos

## Próximos Pasos

Si necesitas:
1. Agregar más formatos de carros → Actualizar las mismas constantes
2. Cambiar capacidades → Actualizar `productFormats.js` en el backend
3. Validaciones específicas por tipo → Extender `validateCaliberFormatCombination()`

---

**Fecha de actualización**: Diciembre 2024
**Versión**: 2.0 - Soporte de Carros

