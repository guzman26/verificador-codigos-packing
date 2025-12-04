import React, { useState, useRef, useEffect } from 'react';
import { Container, Button, MacWindow } from '../../components/ui';
import { CheckCircle, XCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { theme } from '../../styles/theme';
import { validateBoxCode, getReadableInfo, getErrorHelp } from '../../utils/boxCodeValidator';
import type { ValidationError } from '../../utils/boxCodeValidator';
import { playErrorSound, playSuccessSound } from '../../utils/sound';

const CodeValidator: React.FC = () => {
  const [code, setCode] = useState('');
  const [displayLength, setDisplayLength] = useState(0);
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateBoxCode> | null>(null);
  const [history, setHistory] = useState<Array<{ code: string; isValid: boolean; timestamp: Date }>>([]);
  const [expandedHelp, setExpandedHelp] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sincronizar displayLength con code cuando cambia
  useEffect(() => {
    setDisplayLength(code.length);
  }, [code]);

  useEffect(() => {
    if (code.length >= 16) {
      const result = validateBoxCode(code);
      setValidationResult(result);
      setExpandedHelp(null);
      
      setHistory(prev => [{
        code: result.code,
        isValid: result.isValid,
        timestamp: new Date()
      }, ...prev].slice(0, 10));

      if (!result.isValid) {
        playErrorSound();
      } else {
        playSuccessSound();
      }
    } else {
      setValidationResult(null);
      setExpandedHelp(null);
    }
  }, [code]);

  const handleClear = () => {
    setCode('');
    setDisplayLength(0);
    setValidationResult(null);
    setExpandedHelp(null);
    inputRef.current?.focus();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCode(digitsOnly);
    setDisplayLength(digitsOnly.length);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digitsOnly = pastedText.replace(/\D/g, '').slice(0, 16);
    setCode(digitsOnly);
    setDisplayLength(digitsOnly.length);
    
    // Forzar actualización del input
    if (inputRef.current) {
      inputRef.current.value = digitsOnly;
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const digitsOnly = target.value.replace(/\D/g, '').slice(0, 16);
    setCode(digitsOnly);
    setDisplayLength(digitsOnly.length);
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Container maxWidth="xl" padding={false}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>Validador de Códigos de Productos</h1>
            <div style={styles.stats}>
              <StatBadge label="Códigos validados" value={history.length} color={theme.colors.primary} />
              <StatBadge label="Válidos" value={history.filter(h => h.isValid).length} color={theme.colors.success} />
              <StatBadge label="Inválidos" value={history.filter(h => !h.isValid).length} color={theme.colors.error} />
            </div>
          </div>
        </Container>
      </header>

      <Container maxWidth="xl" style={styles.content}>
        <MacWindow title="Escanear Código" width="100%" height="auto" resizable={false}>
          <div style={styles.inputSection}>
            <label style={styles.label}>Escanee o ingrese el código de 16 dígitos:</label>
            
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleCodeChange}
              onPaste={handlePaste}
              onInput={handleInput}
              placeholder="0000000000000000"
              maxLength={20}
              style={{
                ...styles.input,
                borderColor: validationResult 
                  ? (validationResult.isValid ? theme.colors.success : theme.colors.error) 
                  : theme.colors.border.medium
              }}
              autoFocus
            />

            <div style={styles.counter}>
              {displayLength} / 16 dígitos
            </div>

            {code.length > 0 && (
              <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={handleClear}>
                Limpiar y escanear otro
              </Button>
            )}

            {validationResult && (
              <ValidationResultCompact 
                result={validationResult} 
                expandedHelp={expandedHelp}
                onToggleHelp={setExpandedHelp}
              />
            )}

            {!validationResult && <InstructionsCardCompact />}
          </div>
        </MacWindow>

        <MacWindow title="Reglas de Validación" width="100%" height="auto" resizable={false}>
          <div style={styles.rulesGrid}>
            <RuleCard title="Día (pos 0)" value="1-7" description="1=Lun a 7=Dom" />
            <RuleCard title="Semana (pos 1-2)" value="01-53" description="Semana ISO del año" />
            <RuleCard title="Turno (pos 8)" value="1, 2, 3" description="1=Mañana, 2=Tarde, 3=Noche" />
            <RuleCard title="Calibre (pos 9-10)" value="15 valores" description="01-09, 11-16" highlight />
            <RuleCard title="Formato (pos 11)" value="1-6" description="1-3=Cajas, 4-6=Carros" />
            <RuleCard title="Empresa (pos 12)" value="1-5" description="Códigos de empresa válidos" />
          </div>
        </MacWindow>
      </Container>
    </main>
  );
};

const StatBadge: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={styles.statBadge}>
    <span style={styles.statLabel}>{label}:</span>
    <span style={{ ...styles.statValue, color }}>{value}</span>
  </div>
);

const ValidationResultCompact: React.FC<{ 
  result: ReturnType<typeof validateBoxCode>;
  expandedHelp: number | null;
  onToggleHelp: (index: number | null) => void;
}> = ({ result, expandedHelp, onToggleHelp }) => {
  const isValid = result.isValid;
  const bgColor = isValid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const borderColor = isValid ? theme.colors.success : theme.colors.error;

  return (
    <div style={{ ...styles.resultCardCompact, backgroundColor: bgColor, borderColor }}>
      <div style={styles.resultHeaderCompact}>
        {isValid ? (
          <CheckCircle size={24} color={theme.colors.success} />
        ) : (
          <XCircle size={24} color={theme.colors.error} />
        )}
        <h2 style={{ ...styles.resultTitleCompact, color: borderColor }}>
          {isValid ? '✓ CÓDIGO VÁLIDO' : '✗ CÓDIGO INVÁLIDO'}
        </h2>
      </div>

      {result.errors.length > 0 && (
        <div style={styles.errorSectionCompact}>
          <h3 style={styles.errorTitleCompact}>Errores ({result.errors.length}):</h3>
          <div style={styles.errorListCompact}>
            {result.errors.map((error, i) => (
              <ErrorItemCompact 
                key={i} 
                error={error} 
                index={i}
                isExpanded={expandedHelp === i}
                onToggle={() => onToggleHelp(expandedHelp === i ? null : i)}
              />
            ))}
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div style={styles.errorSectionCompact}>
          <h3 style={{ ...styles.errorTitleCompact, color: theme.colors.warning }}>
            Advertencias ({result.warnings.length}):
          </h3>
          <div style={styles.errorListCompact}>
            {result.warnings.map((warning, i) => (
              <ErrorItemCompact 
                key={i} 
                error={warning} 
                index={i + result.errors.length}
                isExpanded={expandedHelp === (i + result.errors.length)}
                onToggle={() => {
                  const idx = i + result.errors.length;
                  onToggleHelp(expandedHelp === idx ? null : idx);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {isValid && result.parsedData && (
        <div style={styles.infoSectionCompact}>
          <h3 style={styles.infoTitleCompact}>Información:</h3>
          <div style={styles.infoGridCompact}>
            {Object.entries(getReadableInfo(result.parsedData)).map(([key, value]) => (
              <span key={key} style={styles.infoItemCompact}>
                <strong>{key}:</strong> {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ErrorItemCompact: React.FC<{ 
  error: ValidationError; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ error, isExpanded, onToggle }) => {
  const color = error.severity === 'error' ? theme.colors.error : theme.colors.warning;
  const helpText = getErrorHelp(error);
  
  return (
    <div style={{ ...styles.errorItemCompact, borderLeftColor: color }}>
      <div style={styles.errorContentCompact}>
        {error.severity === 'error' ? (
          <XCircle size={20} color={theme.colors.error} />
        ) : (
          <AlertTriangle size={20} color={theme.colors.warning} />
        )}
        <div style={{ flex: 1 }}>
          <span style={{ ...styles.errorFieldCompact, color }}>
            {error.field.toUpperCase()} (pos {error.position}):
          </span>{' '}
          <span style={styles.errorMessageCompact}>{error.message}</span>
          {helpText && (
            <button
              onClick={onToggle}
              style={styles.helpButton}
              title={isExpanded ? 'Ocultar ayuda' : 'Ver ayuda'}
            >
              <Info size={16} />
            </button>
          )}
        </div>
      </div>
      {helpText && isExpanded && (
        <div style={styles.errorHelpCompact}>
          {helpText}
        </div>
      )}
    </div>
  );
};

const InstructionsCardCompact: React.FC = () => (
  <div style={styles.instructionsCardCompact}>
    <strong>📋 Instrucciones:</strong> Escanee el código de 16 dígitos con el lector. La validación es automática.
  </div>
);

const RuleCard: React.FC<{ title: string; value: string; description: string; highlight?: boolean }> = ({ 
  title, value, description, highlight 
}) => (
  <div style={{
    ...styles.ruleCard,
    ...(highlight && { borderLeft: `3px solid ${theme.colors.warning}` })
  }}>
    <div style={styles.ruleLabel}>{title}</div>
    <div style={styles.ruleValue}>{value}</div>
    <div style={styles.ruleDescription}>{description}</div>
  </div>
);

const styles = {
  main: { minHeight: '100vh', backgroundColor: theme.colors.background.primary, display: 'flex', flexDirection: 'column' } as React.CSSProperties,
  header: { backgroundColor: theme.colors.background.blur, backdropFilter: `blur(${theme.blur.xl})`, borderBottom: `1px solid ${theme.colors.border.light}`, position: 'sticky', top: 0, zIndex: 100, padding: `${theme.spacing.md} 0` } as React.CSSProperties,
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.lg } as React.CSSProperties,
  title: { fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 } as React.CSSProperties,
  stats: { display: 'flex', gap: theme.spacing.md, alignItems: 'center' } as React.CSSProperties,
  statBadge: { display: 'flex', alignItems: 'center', gap: theme.spacing.xs, padding: `${theme.spacing.xs} ${theme.spacing.sm}`, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.sm, fontSize: theme.typography.fontSize.xs } as React.CSSProperties,
  statLabel: { color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.xs } as React.CSSProperties,
  statValue: { fontWeight: theme.typography.fontWeight.semibold, fontSize: theme.typography.fontSize.sm } as React.CSSProperties,
  content: { flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.xl } as React.CSSProperties,
  inputSection: { padding: theme.spacing.lg, display: 'flex', flexDirection: 'column', gap: theme.spacing.md, alignItems: 'center' } as React.CSSProperties,
  label: { fontSize: theme.typography.fontSize.base, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary } as React.CSSProperties,
  input: { fontSize: '1.8rem', fontWeight: theme.typography.fontWeight.bold, fontFamily: 'monospace', padding: theme.spacing.md, border: '2px solid', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, textAlign: 'center', letterSpacing: '0.1em', outline: 'none', transition: 'all 0.2s ease', width: '100%', maxWidth: '500px' } as React.CSSProperties,
  counter: { fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, textAlign: 'center' } as React.CSSProperties,
  
  resultCardCompact: { padding: theme.spacing.md, borderRadius: theme.borderRadius.md, border: '2px solid', marginTop: theme.spacing.md, width: '100%', maxWidth: '800px' } as React.CSSProperties,
  resultHeaderCompact: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm } as React.CSSProperties,
  resultTitleCompact: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold, margin: 0 } as React.CSSProperties,
  
  errorSectionCompact: { marginBottom: theme.spacing.sm } as React.CSSProperties,
  errorTitleCompact: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.error, marginBottom: theme.spacing.xs } as React.CSSProperties,
  errorListCompact: { display: 'flex', flexDirection: 'column', gap: theme.spacing.sm } as React.CSSProperties,
  errorItemCompact: { padding: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.sm, borderLeft: '3px solid' } as React.CSSProperties,
  errorContentCompact: { display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm } as React.CSSProperties,
  errorFieldCompact: { fontWeight: theme.typography.fontWeight.semibold, fontSize: theme.typography.fontSize.lg } as React.CSSProperties,
  errorMessageCompact: { color: theme.colors.text.primary, fontSize: theme.typography.fontSize.base } as React.CSSProperties,
  errorHelpCompact: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs, paddingTop: theme.spacing.xs, paddingLeft: '24px', borderTop: `1px solid ${theme.colors.border.light}` } as React.CSSProperties,
  
  helpButton: { 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    padding: theme.spacing.xs, 
    marginLeft: theme.spacing.xs,
    display: 'inline-flex',
    alignItems: 'center',
    color: theme.colors.primary,
    verticalAlign: 'middle'
  } as React.CSSProperties,
  
  infoSectionCompact: { marginTop: theme.spacing.sm, paddingTop: theme.spacing.sm, borderTop: `1px solid ${theme.colors.border.light}` } as React.CSSProperties,
  infoTitleCompact: { fontSize: theme.typography.fontSize.base, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, marginBottom: theme.spacing.xs } as React.CSSProperties,
  infoGridCompact: { display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm, fontSize: theme.typography.fontSize.sm } as React.CSSProperties,
  infoItemCompact: { color: theme.colors.text.secondary } as React.CSSProperties,
  
  instructionsCardCompact: { marginTop: theme.spacing.md, padding: theme.spacing.sm, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.md, borderLeft: `3px solid ${theme.colors.primary}`, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, width: '100%', maxWidth: '500px' } as React.CSSProperties,
  
  rulesGrid: { padding: theme.spacing.md, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: theme.spacing.sm } as React.CSSProperties,
  ruleCard: { padding: theme.spacing.sm, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.sm } as React.CSSProperties,
  ruleLabel: { fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium, marginBottom: '2px' } as React.CSSProperties,
  ruleValue: { fontSize: theme.typography.fontSize.base, color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.semibold, marginBottom: '2px' } as React.CSSProperties,
  ruleDescription: { fontSize: theme.typography.fontSize.xs, color: theme.colors.text.secondary } as React.CSSProperties,
};

export default CodeValidator;
