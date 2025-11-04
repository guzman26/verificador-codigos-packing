/** Configuración global de la aplicación */

import { VALID_CALIBERS, CALIBER_COUNT } from '../constants/calibers';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.lomasaltas.com';

export const BOX_CODE_LENGTH = 16;
export const PALLET_CODE_LENGTH = 14;

/** Exportar calibres válidos desde la fuente única */
export { VALID_CALIBERS, CALIBER_COUNT };

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
} as const;

export const VALIDATION_RULES = {
  DAY_OF_WEEK: { min: 1, max: 7 },
  WEEK_OF_YEAR: { min: 1, max: 53 },
  PACKER: { min: 1, max: 9 },
  CALIBER_COUNT: CALIBER_COUNT, // 15 calibres válidos
  SHIFT_COUNT: 3,
  FORMAT_COUNT: 3,
  COMPANY_COUNT: 5,
} as const;
