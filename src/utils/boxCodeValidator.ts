/**
 * Box Code Validator - Valida códigos de caja de 16 dígitos
 * Detecta: día inválido (9), calibre 23, dígitos extra/faltantes, etc.
 */

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

const VALID_CALIBERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '15', '16'];

const CALIBER_NAMES: Record<string, string> = {
  '01': 'ESPECIAL BCO', '02': 'EXTRA BCO', '03': 'ESPECIAL COLOR', '04': 'GRANDE BCO',
  '05': 'EXTRA COLOR', '06': 'GRANDE COLOR', '07': 'MEDIANO BCO', '08': 'SUCIO / TRIZADO',
  '09': 'TERCERA BCO', '11': 'TERCERA COLOR', '12': 'JUMBO BCO', '13': 'MEDIANO COLOR',
  '14': 'JUMBO COLOR', '15': 'CUARTA BCO', '16': 'CUARTA COLOR',
};

const DAY_NAMES = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const SHIFT_NAMES: Record<string, string> = { '1': 'Mañana (06:00-14:00)', '2': 'Tarde (14:00-22:00)', '3': 'Noche (22:00-06:00)' };

const FORMAT_NAMES: Record<string, string> = { '1': '180 unidades', '2': '100 JUMBO', '3': 'Docena' };

const COMPANY_NAMES: Record<string, string> = { '1': 'Lomas Altas', '2': 'Santa Marta', '3': 'Coliumo', '4': 'El Monte', '5': 'Libre' };

/**
 * Valida un código de caja de 16 dígitos completo
 * Verifica: longitud, formato, rango de valores, calibres válidos
 */
export function validateBoxCode(code: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const normalizedCode = code.replace(/[\s-]/g, '');

  if (!normalizedCode) {
    return { isValid: false, errors: [{ field: 'código', position: '-', value: '', message: 'El código no puede estar vacío', severity: 'error' }], warnings: [], code: normalizedCode };
  }

  // Validar longitud exacta (16 dígitos)
  if (normalizedCode.length !== 16) {
    errors.push({
      field: 'longitud',
      position: '-',
      value: normalizedCode.length.toString(),
      message: `Código tiene ${normalizedCode.length} dígitos, debe tener 16`,
      severity: 'error'
    });
  }

  // Validar que solo contenga dígitos
  if (!/^\d+$/.test(normalizedCode)) {
    const invalidChars = normalizedCode.match(/[^\d]/g)?.join(', ') || '';
    errors.push({
      field: 'formato',
      position: '-',
      value: invalidChars,
      message: `El código solo puede contener números. Caracteres inválidos: ${invalidChars}`,
      severity: 'error'
    });
  }

  if (errors.length > 0) return { isValid: false, errors, warnings, code: normalizedCode };

  // Extraer campos del código de 16 dígitos
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

  // Validar cada campo
  validateDayOfWeek(dayOfWeek, errors);
  validateWeekOfYear(weekOfYear, errors);
  validateYearRange(year, warnings);
  validateOperator(operator, warnings);
  validatePacker(packer, errors);
  validateShift(shift, errors);
  validateCaliber(caliber, errors);
  validateFormat(format, errors);
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

/** Valida que el día sea 1-7 (Lunes a Domingo) */
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

/** Valida que la semana sea 01-53 (rango ISO) */
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

/** Advierte si el año está fuera del rango razonable */
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

/** Advierte si operario es 00 */
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

/** Valida que empacadora sea 1-9 (no 0) */
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

/** Valida que turno sea 1, 2 o 3 */
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

/** Valida que calibre esté en la lista de 15 valores válidos */
function validateCaliber(caliber: string, errors: ValidationError[]) {
  if (!VALID_CALIBERS.includes(caliber)) {
    const message = caliber === '23' 
      ? `Calibre 23 NO EXISTE. Los válidos son: 01-09, 11-16`
      : `Calibre ${caliber} es inválido. Los válidos son: 01-09, 11-16`;
    
    errors.push({
      field: 'calibre',
      position: '9-10',
      value: caliber,
      message,
      severity: 'error'
    });
  }
}

/** Valida que formato sea 1, 2 o 3 */
function validateFormat(format: string, errors: ValidationError[]) {
  if (!['1', '2', '3'].includes(format)) {
    errors.push({
      field: 'formato',
      position: '11',
      value: format,
      message: `Formato ${format} es inválido. Debe ser 1 (180u), 2 (100 JUMBO) o 3 (Docena)`,
      severity: 'error'
    });
  }
}

/** Valida que empresa sea 1-5 */
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

/** Valida que contador sea 001-999 (no 000) */
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

/** Convierte datos parseados a información legible para el operario */
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

/** Proporciona mensajes de ayuda contextuales para errores */
export function getErrorHelp(error: ValidationError): string {
  const helpMessages: Record<string, string> = {
    'día de la semana': 'Debe ser 1-7: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo',
    'calibre': 'Válidos: 01, 02, 03, 04, 05, 06, 07, 08, 09, 11, 12, 13, 14, 15, 16 (NO 23)',
    'turno': 'Turnos: 1=Mañana (06:00-14:00), 2=Tarde (14:00-22:00), 3=Noche (22:00-06:00)',
    'formato': 'Formatos: 1=180 unidades, 2=100 JUMBO, 3=Docena',
    'empacadora': 'Debe ser 1-9 (no 0)',
    'empresa': 'Empresas: 1=Lomas Altas, 2=Santa Marta, 3=Coliumo, 4=El Monte, 5=Libre',
  };
  return helpMessages[error.field] || '';
}

