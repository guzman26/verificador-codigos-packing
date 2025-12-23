/**
 * Box Code Validator - Valida códigos de caja de 16 dígitos
 * Detecta: día inválido (9), calibre 23, dígitos extra/faltantes, etc.
 */

import { VALID_CALIBERS, CALIBER_NAMES, JUMBO_CALIBERS } from '../constants/calibers';

export interface ValidationError {
  field: string;
  position: string;
  value: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  code: string;
  parsedData?: {
    dayOfWeek: string;
    weekOfYear: string;
    year: string;
    operator: string;
    packer: string;
    shift: string;
    caliber: string;
    format: string;
    company: string;
    counter: string;
  };
}

const DAY_NAMES = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const SHIFT_NAMES: Record<string, string> = { '1': 'Mañana (06:00-14:00)', '2': 'Tarde (14:00-22:00)', '3': 'Noche (22:00-06:00)' };
export const FORMAT_NAMES: Record<string, string> = { 
  '1': '180 unidades (Caja)', 
  '2': '100 JUMBO (Caja)', 
  '3': 'Docena (Caja)',
  '4': 'Carro - Bandejas 20u (2400 huevos)',
  '5': 'Carro - Bandejas 30u (5400 huevos)',
  '6': 'Carro - Formato especial'
};
export const COMPANY_NAMES: Record<string, string> = { '1': 'Lomas Altas', '2': 'Santa Marta', '3': 'Coliumo', '4': 'El Monte', '5': 'Libre' };

/** Valida un código de caja de 16 dígitos completo */
export function validateBoxCode(code: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const normalizedCode = code.replace(/[\s-]/g, '');

  if (!normalizedCode) {
    return { isValid: false, errors: [{ field: 'código', position: '-', value: '', message: 'El código no puede estar vacío', severity: 'error' }], warnings: [], code: normalizedCode };
  }

  if (normalizedCode.length !== 16) {
    errors.push({
      field: 'longitud',
      position: '-',
      value: normalizedCode.length.toString(),
      message: `Código tiene ${normalizedCode.length} dígitos, debe tener exactamente 16`,
      severity: 'error'
    });
  }

  if (!/^\d+$/.test(normalizedCode)) {
    const invalidChars = normalizedCode.match(/[^\d]/g)?.join(', ') || '';
    errors.push({
      field: 'formato',
      position: '-',
      value: invalidChars,
      message: `Solo se permiten números. Caracteres inválidos: ${invalidChars}`,
      severity: 'error'
    });
  }

  if (errors.length > 0) return { isValid: false, errors, warnings, code: normalizedCode };

  const dayOfWeek = normalizedCode[0];
  const weekOfYear = normalizedCode.substring(1, 3);
  const year = normalizedCode.substring(3, 5);
  const operator = normalizedCode.substring(5, 7);
  const packer = normalizedCode[7];
  const shift = normalizedCode[8];
  const caliber = normalizedCode.substring(9, 11);
  const format = normalizedCode[11];
  const company = normalizedCode[12];
  const counter = normalizedCode.substring(13, 16);

  validateDayOfWeek(dayOfWeek, errors);
  validateWeekOfYear(weekOfYear, errors);
  validateYearRange(year, warnings);
  validateOperator(operator, warnings);
  validatePacker(packer, errors);
  validateShift(shift, errors);
  validateCaliber(caliber, errors);
  validateFormat(format, errors);
  validateCaliberFormatCombination(caliber, format, errors);
  validateCompany(company, errors);
  validateCounter(counter, errors);

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    code: normalizedCode,
    parsedData: isValid ? { dayOfWeek, weekOfYear, year: `20${year}`, operator, packer, shift, caliber, format, company, counter } : undefined
  };
}

function validateDayOfWeek(dayOfWeek: string, errors: ValidationError[]) {
  const dayNum = parseInt(dayOfWeek);
  if (dayNum < 1 || dayNum > 7) {
    errors.push({
      field: 'día de la semana',
      position: '0',
      value: dayOfWeek,
      message: `Día ${dayOfWeek} es inválido. Debe ser 1-7 (1=Lunes, 7=Domingo)`,
      severity: 'error'
    });
  }
}

function validateWeekOfYear(weekOfYear: string, errors: ValidationError[]) {
  const weekNum = parseInt(weekOfYear);
  if (weekNum < 1 || weekNum > 53) {
    errors.push({
      field: 'semana del año',
      position: '1-2',
      value: weekOfYear,
      message: `Semana ${weekOfYear} es inválida. Debe ser 01-53`,
      severity: 'error'
    });
  }
}

function validateYearRange(year: string, warnings: ValidationError[]) {
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear() % 100;
  if (yearNum < currentYear - 2 || yearNum > currentYear + 5) {
    warnings.push({
      field: 'año',
      position: '3-4',
      value: year,
      message: `Año 20${year} parece inusual. Verifique que sea correcto`,
      severity: 'warning'
    });
  }
}

function validateOperator(operator: string, warnings: ValidationError[]) {
  if (parseInt(operator) === 0) {
    warnings.push({
      field: 'operario',
      position: '5-6',
      value: operator,
      message: 'Operario 00 es inusual',
      severity: 'warning'
    });
  }
}

function validatePacker(packer: string, errors: ValidationError[]) {
  const packerNum = parseInt(packer);
  if (packerNum < 1 || packerNum > 9) {
    errors.push({
      field: 'empacadora',
      position: '7',
      value: packer,
      message: `Empacadora ${packer} es inválida. Debe ser 1-9`,
      severity: 'error'
    });
  }
}

function validateShift(shift: string, errors: ValidationError[]) {
  if (!['1', '2', '3'].includes(shift)) {
    errors.push({
      field: 'turno',
      position: '8',
      value: shift,
      message: `Turno ${shift} es inválido. Debe ser 1 (Mañana), 2 (Tarde) o 3 (Noche)`,
      severity: 'error'
    });
  }
}

function validateCaliber(caliber: string, errors: ValidationError[]) {
  if (!VALID_CALIBERS.includes(caliber as any)) {
    const message = caliber === '23' 
      ? `Calibre 23 NO EXISTE. Válidos: ${VALID_CALIBERS.join(', ')}`
      : caliber === '10'
      ? `Calibre 10 NO EXISTE. Válidos: ${VALID_CALIBERS.join(', ')}`
      : `Calibre ${caliber} es inválido. Solo 15 calibres válidos: ${VALID_CALIBERS.join(', ')}`;
    
    errors.push({
      field: 'calibre',
      position: '9-10',
      value: caliber,
      message,
      severity: 'error'
    });
  }
}

function validateFormat(format: string, errors: ValidationError[]) {
  if (!['1', '2', '3', '4', '5', '6'].includes(format)) {
    errors.push({
      field: 'formato',
      position: '11',
      value: format,
      message: `Formato ${format} es inválido. Válidos: 1-3 (Cajas), 4-6 (Carros)`,
      severity: 'error'
    });
  }
}

function validateCaliberFormatCombination(caliber: string, format: string, errors: ValidationError[]) {
  // JUMBO calibers (12 and 14) can ONLY use format 2 (100 JUMBO) for boxes
  if (JUMBO_CALIBERS.includes(caliber as any) && format === '1') {
    const caliberName = CALIBER_NAMES[caliber] || caliber;
    errors.push({
      field: 'formato',
      position: '9-11',
      value: `${caliber}-${format}`,
      message: `Calibre JUMBO (${caliberName}) no puede usar formato 1 (180u). Solo se permite formato 2 (100 JUMBO)`,
      severity: 'error'
    });
  }

  // Carros (formato 4-6) no deberían usar calibres JUMBO en cajas
  const isCartFormat = ['4', '5', '6'].includes(format);
  if (isCartFormat && JUMBO_CALIBERS.includes(caliber as any)) {
    const caliberName = CALIBER_NAMES[caliber] || caliber;
    errors.push({
      field: 'formato',
      position: '9-11',
      value: `${caliber}-${format}`,
      message: `Advertencia: Calibre JUMBO (${caliberName}) con formato de carro. Verifique que sea correcto.`,
      severity: 'error'
    });
  }
}

function validateCompany(company: string, errors: ValidationError[]) {
  if (!['1', '2', '3', '4', '5'].includes(company)) {
    errors.push({
      field: 'empresa',
      position: '12',
      value: company,
      message: `Empresa ${company} es inválida. Debe ser 1-5`,
      severity: 'error'
    });
  }
}

function validateCounter(counter: string, errors: ValidationError[]) {
  if (parseInt(counter) === 0) {
    errors.push({
      field: 'contador',
      position: '13-15',
      value: counter,
      message: `Contador no puede ser 000`,
      severity: 'error'
    });
  }
}

export function getReadableInfo(parsedData: ValidationResult['parsedData']): Record<string, string> {
  if (!parsedData) return {};
  const dayNum = parseInt(parsedData.dayOfWeek);
  return {
    'Día': DAY_NAMES[dayNum] || parsedData.dayOfWeek,
    'Semana': `Semana ${parseInt(parsedData.weekOfYear)}`,
    'Año': parsedData.year,
    'Operario': `Operario ${parsedData.operator}`,
    'Empacadora': `Empacadora ${parsedData.packer}`,
    'Turno': SHIFT_NAMES[parsedData.shift] || parsedData.shift,
    'Calibre': CALIBER_NAMES[parsedData.caliber] || parsedData.caliber,
    'Formato': FORMAT_NAMES[parsedData.format] || parsedData.format,
    'Empresa': COMPANY_NAMES[parsedData.company] || parsedData.company,
    'Contador': `Caja #${parsedData.counter}`,
  };
}

export function getErrorHelp(error: ValidationError): string {
  const helpMessages: Record<string, string> = {
    'día de la semana': 'Debe ser 1-7: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo',
    'calibre': `Solo son válidos estos 15 calibres: ${VALID_CALIBERS.join(', ')}. El calibre 23 NO existe.`,
    'turno': 'Turnos: 1=Mañana (06:00-14:00), 2=Tarde (14:00-22:00), 3=Noche (22:00-06:00)',
    'formato': 'CAJAS: 1=180u, 2=100 JUMBO, 3=Docena. CARROS: 4=Bandejas 20u (2400 huevos), 5=Bandejas 30u (5400 huevos), 6=Especial. IMPORTANTE: Calibres JUMBO (12 y 14) solo pueden usar formato 2 en cajas',
    'empacadora': 'Debe ser 1-9 (no 0)',
    'empresa': 'Empresas: 1=Lomas Altas, 2=Santa Marta, 3=Coliumo, 4=El Monte, 5=Libre',
  };
  return helpMessages[error.field] || '';
}

/** Parámetros esperados para comparar con el código */
export interface ExpectedParams {
  shift?: string;
  format?: string;
  company?: string;
}

/** Resultado de comparación de un parámetro */
export interface ParamComparisonResult {
  field: string;
  expected: string;
  actual: string;
  expectedLabel: string;
  actualLabel: string;
  matches: boolean;
}

/** Compara los datos parseados del código con los parámetros esperados */
export function compareCodeWithExpectedParams(
  parsedData: ValidationResult['parsedData'],
  expectedParams: ExpectedParams
): ParamComparisonResult[] {
  if (!parsedData) return [];
  
  const results: ParamComparisonResult[] = [];
  
  if (expectedParams.shift) {
    results.push({
      field: 'Turno',
      expected: expectedParams.shift,
      actual: parsedData.shift,
      expectedLabel: SHIFT_NAMES[expectedParams.shift],
      actualLabel: SHIFT_NAMES[parsedData.shift],
      matches: expectedParams.shift === parsedData.shift
    });
  }
  
  if (expectedParams.format) {
    results.push({
      field: 'Formato',
      expected: expectedParams.format,
      actual: parsedData.format,
      expectedLabel: FORMAT_NAMES[expectedParams.format],
      actualLabel: FORMAT_NAMES[parsedData.format],
      matches: expectedParams.format === parsedData.format
    });
  }
  
  if (expectedParams.company) {
    results.push({
      field: 'Empresa',
      expected: expectedParams.company,
      actual: parsedData.company,
      expectedLabel: COMPANY_NAMES[expectedParams.company],
      actualLabel: COMPANY_NAMES[parsedData.company],
      matches: expectedParams.company === parsedData.company
    });
  }
  
  return results;
}
