/**
 * CALIBRES VÁLIDOS
 * 
 * Lista oficial de los 15 calibres permitidos en los códigos de caja.
 * Cualquier otro valor debe ser rechazado.
 * 
 * Valores INVÁLIDOS incluyen: 00, 10, 17-22, 23, 24-99
 */

export const VALID_CALIBERS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '11', '12', '13',
  '14', '15', '16'
] as const;

export type ValidCaliber = typeof VALID_CALIBERS[number];

/** Calibres Blancos (BCO) */
export const WHITE_CALIBERS = {
  '01': 'ESPECIAL BCO',
  '02': 'EXTRA BCO',
  '04': 'GRANDE BCO',
  '07': 'MEDIANO BCO',
  '09': 'TERCERA BCO',
  '12': 'JUMBO BCO',
  '15': 'CUARTA BCO',
} as const;

/** Calibres de Color */
export const COLOR_CALIBERS = {
  '03': 'ESPECIAL COLOR',
  '05': 'EXTRA COLOR',
  '06': 'GRANDE COLOR',
  '11': 'TERCERA COLOR',
  '13': 'MEDIANO COLOR',
  '14': 'JUMBO COLOR',
  '16': 'CUARTA COLOR',
} as const;

/** Calibres Especiales */
export const SPECIAL_CALIBERS = {
  '08': 'SUCIO / TRIZADO',
} as const;

/** Todos los calibres con sus nombres */
export const CALIBER_NAMES: Record<string, string> = {
  ...WHITE_CALIBERS,
  ...COLOR_CALIBERS,
  ...SPECIAL_CALIBERS,
};

/** Verifica si un calibre es válido */
export const isValidCaliber = (caliber: string): caliber is ValidCaliber => {
  return (VALID_CALIBERS as readonly string[]).includes(caliber);
};

/** Obtiene el nombre legible de un calibre */
export const getCaliberName = (caliber: string): string => {
  return CALIBER_NAMES[caliber] || caliber;
};

/** Cuenta total de calibres válidos */
export const CALIBER_COUNT = VALID_CALIBERS.length; // 15

