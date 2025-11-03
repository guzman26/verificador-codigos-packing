/** Configuración global de la aplicación */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.lomasaltas.com';

export const BOX_CODE_LENGTH = 16;
export const PALLET_CODE_LENGTH = 14;

export const VALID_CALIBERS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '11', '12', '13',
  '14', '15', '16'
] as const;

export const SHIFTS = {
  MORNING: '1',
  AFTERNOON: '2',
  NIGHT: '3',
} as const;

export const FORMATS = {
  FORMAT_180: '1',
  FORMAT_100_JUMBO: '2',
  FORMAT_DOZEN: '3',
} as const;

export const COMPANIES = {
  LOMAS_ALTAS: '1',
  SANTA_MARTA: '2',
  COLIUMO: '3',
  EL_MONTE: '4',
  LIBRE: '5',
} as const;

export const ROUTES = {
  HOME: '/',
  VALIDATE_CODE: '/validate-code',
  CREATE_PALLET: '/create-pallet',
} as const;

