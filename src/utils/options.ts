// Centralised select options for Create Pallet form and any other UI.
// Using explicit value/label pairs keeps components generic and improves maintainability.

export const CALIBRE_OPTIONS = [
  { value: '', label: 'Seleccione un calibre' },
  { value: '01', label: 'ESPECIAL BCO' },
  { value: '02', label: 'EXTRA BCO' },
  { value: '04', label: 'GRANDE BCO' },
  { value: '07', label: 'MEDIANO BCO' },
  { value: '09', label: 'TERCERA BCO' },
  { value: '15', label: 'CUARTA BCO' },
  { value: '12', label: 'JUMBO BCO' },
  { value: '03', label: 'ESPECIAL COLOR' },
  { value: '05', label: 'EXTRA COLOR' },
  { value: '06', label: 'GRANDE COLOR' },
  { value: '13', label: 'MEDIANO COLOR' },
  { value: '11', label: 'TERCERA COLOR' },
  { value: '16', label: 'CUARTA COLOR' },
  { value: '14', label: 'JUMBO COLOR' },
  { value: '08', label: 'SUCIO / TRIZADO' },
];

export const TURNO_OPTIONS = [
  { value: '', label: 'Seleccione un turno' },
  { value: '1', label: 'Turno 1 (Mañana)' },
  { value: '2', label: 'Turno 2 (Tarde)' },
  { value: '3', label: 'Turno 3 (Noche)' },
];

export const FORMATO_OPTIONS = [
  { value: '', label: 'Seleccione un formato' },
  { value: '1', label: 'Formato 1 - Caja 180 unidades' },
  { value: '2', label: 'Formato 2 - Caja 100 JUMBO' },
  { value: '3', label: 'Formato 3 - Caja Docena' },
  { value: '4', label: 'Formato 4 - Carro Bandejas 20u (2400 huevos)' },
  { value: '5', label: 'Formato 5 - Carro Bandejas 30u (5400 huevos)' },
  { value: '6', label: 'Formato 6 - Carro formato especial' },
];

export const EMPRESA_OPTIONS = [
  { value: '', label: 'Seleccione una empresa' },
  { value: '01', label: 'Lomas Altas' },
  { value: '02', label: 'Santa Marta' },
  { value: '03', label: 'Coliumo' },
  { value: '04', label: 'El Monte' },
  { value: '05', label: 'Libre' },
]; 