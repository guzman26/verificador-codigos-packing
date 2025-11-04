# 🥚 Calibres Válidos - Referencia Oficial

## Resumen

**Total de calibres válidos: 15**

Los calibres son códigos de 2 dígitos que identifican el tamaño y tipo del huevo.

## ✅ Calibres Válidos

### Blancos (BCO) - 7 calibres

| Código | Nombre | Descripción |
|--------|--------|-------------|
| **01** | ESPECIAL BCO | Huevo blanco especial |
| **02** | EXTRA BCO | Huevo blanco extra |
| **04** | GRANDE BCO | Huevo blanco grande |
| **07** | MEDIANO BCO | Huevo blanco mediano |
| **09** | TERCERA BCO | Huevo blanco tercera |
| **12** | JUMBO BCO | Huevo blanco jumbo |
| **15** | CUARTA BCO | Huevo blanco cuarta |

### Color - 7 calibres

| Código | Nombre | Descripción |
|--------|--------|-------------|
| **03** | ESPECIAL COLOR | Huevo de color especial |
| **05** | EXTRA COLOR | Huevo de color extra |
| **06** | GRANDE COLOR | Huevo de color grande |
| **11** | TERCERA COLOR | Huevo de color tercera |
| **13** | MEDIANO COLOR | Huevo de color mediano |
| **14** | JUMBO COLOR | Huevo de color jumbo |
| **16** | CUARTA COLOR | Huevo de color cuarta |

### Especiales - 1 calibre

| Código | Nombre | Descripción |
|--------|--------|-------------|
| **08** | SUCIO / TRIZADO | Huevos con defectos |

## ❌ Calibres Inválidos

**Todos los demás valores son INVÁLIDOS**, incluyendo:

- `00` - NO existe
- `10` - NO existe (brinca del 09 al 11)
- `17` a `22` - NO existen
- **`23`** - ⚠️ **ESPECÍFICAMENTE INVÁLIDO** (error común)
- `24` a `99` - NO existen

## 📊 Lista Completa en Orden

```
01, 02, 03, 04, 05, 06, 07, 08, 09, 11, 12, 13, 14, 15, 16
```

**Nota:** El `10` NO está en la lista.

## 🔍 Validación

Para que un código de caja sea válido, el calibre (posiciones 9-10) debe ser **exactamente** uno de los 15 valores listados arriba.

### Ejemplos de Validación

```
✅ VÁLIDO:   ...02... (EXTRA BCO)
✅ VÁLIDO:   ...13... (MEDIANO COLOR)
✅ VÁLIDO:   ...08... (SUCIO / TRIZADO)

❌ INVÁLIDO: ...23... (NO EXISTE)
❌ INVÁLIDO: ...10... (NO EXISTE)
❌ INVÁLIDO: ...00... (NO EXISTE)
❌ INVÁLIDO: ...99... (NO EXISTE)
```

## 💻 Implementación en Código

```typescript
// Constante oficial de calibres válidos
const VALID_CALIBERS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '11', '12', '13',
  '14', '15', '16'
];

// Validación
function isValidCaliber(caliber: string): boolean {
  return VALID_CALIBERS.includes(caliber);
}
```

## 📝 Notas

1. Los calibres son **códigos de 2 dígitos** con leading zero si es necesario
2. No existe una correlación directa entre el número y el tamaño
3. El calibre `23` es el error más común reportado
4. El calibre `10` no existe (la secuencia salta del `09` al `11`)

---

**Última actualización:** Noviembre 2025  
**Fuente:** Sistemas de gestión Lomas Altas

