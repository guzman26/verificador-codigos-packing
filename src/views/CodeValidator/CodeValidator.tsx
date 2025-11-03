import React, { useState, useRef, useEffect } from 'react';
import { Container, Button, MacWindow } from '../../components/ui';
import { CheckCircle, XCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { theme } from '../../styles/theme';
import { validateBoxCode, getReadableInfo, getErrorHelp } from '../../utils/boxCodeValidator';
import type { ValidationError } from '../../utils/boxCodeValidator';
import { playErrorSound } from '../../utils/sound';

const CodeValidator: React.FC = () => {
  const [code, setCode] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateBoxCode> | null>(null);
  const [history, setHistory] = useState<Array<{ code: string; isValid: boolean; timestamp: Date }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (code.length >= 16) {
      const result = validateBoxCode(code);
      setValidationResult(result);
      
      setHistory(prev => [{
        code: result.code,
        isValid: result.isValid,
        timestamp: new Date()
      }, ...prev].slice(0, 10));

      if (!result.isValid) {
        playErrorSound();
      }
    } else {
      setValidationResult(null);
    }
  }, [code]);

  const handleClear = () => {
    setCode('');
    setValidationResult(null);
    inputRef.current?.focus();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, ''));
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Container maxWidth="xl" padding={false}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>Validador de Códigos de Cajas</h1>
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
              {code.length} / 16 dígitos
              {code.length > 0 && code.length < 16 && (
                <span style={{ color: theme.colors.warning, marginLeft: theme.spacing.sm }}>
                  (faltan {16 - code.length})
                </span>
              )}
            </div>

            {code.length > 0 && (
              <Button variant="secondary" icon={<RotateCcw size={18} />} onClick={handleClear}>
                Limpiar y escanear otro
              </Button>
            )}

            {validationResult && <ValidationResultCard result={validationResult} />}

            {!validationResult && <InstructionsCard />}
          </div>
        </MacWindow>

        <MacWindow title="Reglas de Validación" width="100%" height="auto" resizable={false}>
          <div style={styles.rulesGrid}>
            <RuleCard title="Día (pos 0)" value="1-7" description="1=Lun a 7=Dom" />
            <RuleCard title="Semana (pos 1-2)" value="01-53" description="Semana ISO del año" />
            <RuleCard title="Turno (pos 8)" value="1, 2, 3" description="1=Mañana, 2=Tarde, 3=Noche" />
            <RuleCard title="Calibre (pos 9-10)" value="15 valores" description="01-09, 11-16 (NO 23)" highlight />
            <RuleCard title="Formato (pos 11)" value="1, 2, 3" description="1=180u, 2=100 JUMBO, 3=Docena" />
            <RuleCard title="Empresa (pos 12)" value="1-5" description="Códigos de empresa válidos" />
          </div>
        </MacWindow>

        {history.length > 0 && (
          <MacWindow title="Historial de Validaciones" width="100%" height="auto" resizable={false}>
            <div style={styles.historySection}>
              {history.map((item, idx) => (
                <div key={idx} style={styles.historyItem}>
                  <div style={styles.historyCode}>{item.code}</div>
                  <div style={{ 
                    ...styles.historyStatus,
                    color: item.isValid ? theme.colors.success : theme.colors.error
                  }}>
                    {item.isValid ? '✓ VÁLIDO' : '✗ INVÁLIDO'}
                  </div>
                </div>
              ))}
            </div>
          </MacWindow>
        )}
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

const ValidationResultCard: React.FC<{ result: ReturnType<typeof validateBoxCode> }> = ({ result }) => {
  const isValid = result.isValid;
  const bgColor = isValid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const borderColor = isValid ? theme.colors.success : theme.colors.error;

  return (
    <div style={{ ...styles.resultCard, backgroundColor: bgColor, borderColor }}>
      <div style={styles.resultHeader}>
        {isValid ? (
          <CheckCircle size={32} color={theme.colors.success} />
        ) : (
          <XCircle size={32} color={theme.colors.error} />
        )}
        <h2 style={{ ...styles.resultTitle, color: borderColor }}>
          {isValid ? '✓ CÓDIGO VÁLIDO' : '✗ CÓDIGO INVÁLIDO'}
        </h2>
      </div>

      {result.errors.length > 0 && (
        <div style={styles.errorSection}>
          <h3 style={styles.errorTitle}>Errores encontrados ({result.errors.length}):</h3>
          <ul style={styles.errorList}>
            {result.errors.map((error, i) => <ErrorItem key={i} error={error} />)}
          </ul>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div style={styles.errorSection}>
          <h3 style={{ ...styles.errorTitle, color: theme.colors.warning }}>
            Advertencias ({result.warnings.length}):
          </h3>
          <ul style={styles.errorList}>
            {result.warnings.map((warning, i) => <ErrorItem key={i} error={warning} />)}
          </ul>
        </div>
      )}

      {isValid && result.parsedData && (
        <div>
          <h3 style={styles.infoTitle}>Información del código:</h3>
          <div style={styles.infoGrid}>
            {Object.entries(getReadableInfo(result.parsedData)).map(([key, value]) => (
              <div key={key} style={styles.infoItem}>
                <div style={styles.infoLabel}>{key}</div>
                <div style={styles.infoValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ErrorItem: React.FC<{ error: ValidationError }> = ({ error }) => {
  const color = error.severity === 'error' ? theme.colors.error : theme.colors.warning;
  
  return (
    <li style={{ ...styles.errorItem, borderLeftColor: color }}>
      <div style={styles.errorContent}>
        {error.severity === 'error' ? (
          <XCircle size={20} color={theme.colors.error} />
        ) : (
          <AlertTriangle size={20} color={theme.colors.warning} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ ...styles.errorField, color }}>
            {error.field.toUpperCase()} (Posición {error.position})
          </div>
          <div style={styles.errorMessage}>{error.message}</div>
          {getErrorHelp(error) && (
            <div style={styles.errorHelp}>
              <Info size={14} style={{ display: 'inline', marginRight: theme.spacing.xs }} />
              {getErrorHelp(error)}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

const InstructionsCard: React.FC = () => (
  <div style={styles.instructionsCard}>
    <h3 style={styles.instructionsTitle}>📋 Instrucciones:</h3>
    <ul style={styles.instructionsList}>
      <li>Escanee el código de barras con el lector</li>
      <li>El código debe tener exactamente 16 dígitos</li>
      <li>Solo se permiten números (0-9)</li>
      <li>La validación es automática e instantánea</li>
      <li>Los códigos se guardan en el historial local</li>
    </ul>
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
  header: { backgroundColor: theme.colors.background.blur, backdropFilter: `blur(${theme.blur.xl})`, borderBottom: `1px solid ${theme.colors.border.light}`, position: 'sticky', top: 0, zIndex: 100, padding: `${theme.spacing.lg} 0` } as React.CSSProperties,
  headerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.xl } as React.CSSProperties,
  title: { fontSize: theme.typography.fontSize['3xl'], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text.primary, margin: 0 } as React.CSSProperties,
  stats: { display: 'flex', gap: theme.spacing.lg, alignItems: 'center' } as React.CSSProperties,
  statBadge: { display: 'flex', alignItems: 'center', gap: theme.spacing.xs, padding: `${theme.spacing.xs} ${theme.spacing.sm}`, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.md, fontSize: theme.typography.fontSize.sm } as React.CSSProperties,
  statLabel: { color: theme.colors.text.secondary } as React.CSSProperties,
  statValue: { fontWeight: theme.typography.fontWeight.semibold } as React.CSSProperties,
  content: { flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing['2xl'], paddingTop: theme.spacing['2xl'], paddingBottom: theme.spacing['3xl'] } as React.CSSProperties,
  inputSection: { padding: theme.spacing.xl, display: 'flex', flexDirection: 'column', gap: theme.spacing.lg, alignItems: 'center' } as React.CSSProperties,
  label: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.text.primary } as React.CSSProperties,
  input: { fontSize: '2.5rem', fontWeight: theme.typography.fontWeight.bold, fontFamily: 'monospace', padding: theme.spacing.xl, border: '2px solid', borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, textAlign: 'center', letterSpacing: '0.1em', outline: 'none', transition: 'all 0.2s ease', width: '100%', maxWidth: '600px' } as React.CSSProperties,
  counter: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, textAlign: 'center' } as React.CSSProperties,
  resultCard: { padding: theme.spacing.xl, borderRadius: theme.borderRadius.lg, border: '2px solid', marginTop: theme.spacing.xl, width: '100%' } as React.CSSProperties,
  resultHeader: { display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg } as React.CSSProperties,
  resultTitle: { fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.bold, margin: 0 } as React.CSSProperties,
  errorSection: { marginBottom: theme.spacing.lg } as React.CSSProperties,
  errorTitle: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.error, marginBottom: theme.spacing.md } as React.CSSProperties,
  errorList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing.md } as React.CSSProperties,
  errorItem: { padding: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.md, borderLeft: '4px solid' } as React.CSSProperties,
  errorContent: { display: 'flex', alignItems: 'flex-start', gap: theme.spacing.md } as React.CSSProperties,
  errorField: { fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing.xs } as React.CSSProperties,
  errorMessage: { color: theme.colors.text.primary, marginBottom: theme.spacing.xs } as React.CSSProperties,
  errorHelp: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.sm, paddingTop: theme.spacing.sm, borderTop: `1px solid ${theme.colors.border.light}` } as React.CSSProperties,
  infoTitle: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, marginBottom: theme.spacing.md } as React.CSSProperties,
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md } as React.CSSProperties,
  infoItem: { padding: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.md } as React.CSSProperties,
  infoLabel: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium, marginBottom: theme.spacing.xs } as React.CSSProperties,
  infoValue: { fontSize: theme.typography.fontSize.lg, color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.semibold } as React.CSSProperties,
  instructionsCard: { marginTop: theme.spacing.xl, padding: theme.spacing.lg, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.lg, borderLeft: `4px solid ${theme.colors.primary}`, width: '100%' } as React.CSSProperties,
  instructionsTitle: { fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text.primary, marginBottom: theme.spacing.md } as React.CSSProperties,
  instructionsList: { color: theme.colors.text.secondary, paddingLeft: theme.spacing.xl, lineHeight: 1.6 } as React.CSSProperties,
  rulesGrid: { padding: theme.spacing.xl, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md } as React.CSSProperties,
  ruleCard: { padding: theme.spacing.md, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.md } as React.CSSProperties,
  ruleLabel: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, fontWeight: theme.typography.fontWeight.medium, marginBottom: theme.spacing.xs } as React.CSSProperties,
  ruleValue: { fontSize: theme.typography.fontSize.lg, color: theme.colors.text.primary, fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.spacing.xs } as React.CSSProperties,
  ruleDescription: { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary } as React.CSSProperties,
  historySection: { padding: theme.spacing.lg, display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, maxHeight: '300px', overflowY: 'auto' } as React.CSSProperties,
  historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.sm, backgroundColor: theme.colors.background.secondary, borderRadius: theme.borderRadius.sm } as React.CSSProperties,
  historyCode: { fontFamily: 'monospace', fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary } as React.CSSProperties,
  historyStatus: { fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold } as React.CSSProperties,
};

export default CodeValidator;
