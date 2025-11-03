import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, MacWindow } from '../../components/ui';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { theme } from '../../styles/theme';
import { validateBoxCode, getReadableInfo, getErrorHelp, ValidationError } from '../../utils/boxCodeValidator';
import { playErrorSound } from '../../utils/sound';

const CodeValidator: React.FC = () => {
  const [code, setCode] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateBoxCode> | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus el input cuando se monta el componente
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Validar cuando cambia el código
  useEffect(() => {
    if (code.length >= 16) {
      const result = validateBoxCode(code);
      setValidationResult(result);
      setShowDetails(true);
      
      // Reproducir sonido de error si hay errores
      if (!result.isValid) {
        playErrorSound();
      }
    } else {
      setValidationResult(null);
      setShowDetails(false);
    }
  }, [code]);

  const handleClear = () => {
    setCode('');
    setValidationResult(null);
    setShowDetails(false);
    inputRef.current?.focus();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setCode(value);
  };

  const mainStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.blur,
    backdropFilter: `blur(${theme.blur.xl})`,
    WebkitBackdropFilter: `blur(${theme.blur.xl})`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: `${theme.spacing.lg} 0`,
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing['3xl'],
  };

  const inputContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  };

  const inputStyles: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: theme.typography.fontWeight.bold,
    fontFamily: 'monospace',
    padding: theme.spacing.xl,
    border: `2px solid ${validationResult ? (validationResult.isValid ? theme.colors.success : theme.colors.error) : theme.colors.border.medium}`,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: '0.1em',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const resultCardStyles = (isValid: boolean): React.CSSProperties => ({
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: isValid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    border: `2px solid ${isValid ? theme.colors.success : theme.colors.error}`,
    marginTop: theme.spacing.xl,
  });

  const resultHeaderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const resultTitleStyles = (isValid: boolean): React.CSSProperties => ({
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: isValid ? theme.colors.success : theme.colors.error,
    margin: 0,
  });

  const errorListStyles: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const errorItemStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${theme.colors.error}`,
  };

  const warningItemStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${theme.colors.warning}`,
  };

  const infoGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  };

  const infoItemStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  };

  const infoLabelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  };

  const infoValueStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  };

  const renderError = (error: ValidationError, index: number) => (
    <li key={index} style={error.severity === 'error' ? errorItemStyles : warningItemStyles}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing.md }}>
        {error.severity === 'error' ? (
          <XCircle size={20} color={theme.colors.error} style={{ flexShrink: 0, marginTop: '2px' }} />
        ) : (
          <AlertTriangle size={20} color={theme.colors.warning} style={{ flexShrink: 0, marginTop: '2px' }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: theme.typography.fontWeight.semibold,
            color: error.severity === 'error' ? theme.colors.error : theme.colors.warning,
            marginBottom: theme.spacing.xs,
          }}>
            {error.field.toUpperCase()} (Posición {error.position})
          </div>
          <div style={{ 
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
          }}>
            {error.message}
          </div>
          {getErrorHelp(error) && (
            <div style={{ 
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginTop: theme.spacing.sm,
              paddingTop: theme.spacing.sm,
              borderTop: `1px solid ${theme.colors.border.light}`,
            }}>
              <Info size={14} style={{ display: 'inline', marginRight: theme.spacing.xs }} />
              {getErrorHelp(error)}
            </div>
          )}
        </div>
      </div>
    </li>
  );

  return (
    <main style={mainStyles}>
      <header style={headerStyles}>
        <Container maxWidth="xl" padding={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" icon={<ArrowLeft size={20} />}>
                Volver
              </Button>
            </Link>
            <h1 style={{ 
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              margin: 0,
            }}>
              Validador de Códigos de Cajas
            </h1>
          </div>
        </Container>
      </header>

      <Container maxWidth="xl" style={contentStyles}>
        <MacWindow
          title="Escanear Código"
          width="100%"
          height="auto"
          resizable={false}
        >
          <div style={{ padding: theme.spacing.xl }}>
            <div style={inputContainerStyles}>
              <label style={{ 
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
              }}>
                Escanee o ingrese el código de 16 dígitos:
              </label>
              
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="0000000000000000"
                maxLength={20}
                style={inputStyles}
                autoFocus
              />

              <div style={{ 
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                textAlign: 'center',
              }}>
                {code.length} / 16 dígitos
              </div>

              {code.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md }}>
                  <Button variant="secondary" onClick={handleClear}>
                    Limpiar
                  </Button>
                </div>
              )}
            </div>

            {validationResult && showDetails && (
              <div style={resultCardStyles(validationResult.isValid)}>
                <div style={resultHeaderStyles}>
                  {validationResult.isValid ? (
                    <CheckCircle size={32} color={theme.colors.success} />
                  ) : (
                    <XCircle size={32} color={theme.colors.error} />
                  )}
                  <h2 style={resultTitleStyles(validationResult.isValid)}>
                    {validationResult.isValid ? '✓ CÓDIGO VÁLIDO' : '✗ CÓDIGO INVÁLIDO'}
                  </h2>
                </div>

                {/* Mostrar errores */}
                {validationResult.errors.length > 0 && (
                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <h3 style={{ 
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.error,
                      marginBottom: theme.spacing.md,
                    }}>
                      Errores encontrados ({validationResult.errors.length}):
                    </h3>
                    <ul style={errorListStyles}>
                      {validationResult.errors.map((error, index) => renderError(error, index))}
                    </ul>
                  </div>
                )}

                {/* Mostrar advertencias */}
                {validationResult.warnings.length > 0 && (
                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <h3 style={{ 
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.warning,
                      marginBottom: theme.spacing.md,
                    }}>
                      Advertencias ({validationResult.warnings.length}):
                    </h3>
                    <ul style={errorListStyles}>
                      {validationResult.warnings.map((warning, index) => renderError(warning, index))}
                    </ul>
                  </div>
                )}

                {/* Mostrar información del código si es válido */}
                {validationResult.isValid && validationResult.parsedData && (
                  <div>
                    <h3 style={{ 
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.md,
                    }}>
                      Información del código:
                    </h3>
                    <div style={infoGridStyles}>
                      {Object.entries(getReadableInfo(validationResult.parsedData)).map(([key, value]) => (
                        <div key={key} style={infoItemStyles}>
                          <div style={infoLabelStyles}>{key}</div>
                          <div style={infoValueStyles}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instrucciones */}
            {!validationResult && (
              <div style={{ 
                marginTop: theme.spacing.xl,
                padding: theme.spacing.lg,
                backgroundColor: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg,
                borderLeft: `4px solid ${theme.colors.primary}`,
              }}>
                <h3 style={{ 
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.md,
                }}>
                  Instrucciones:
                </h3>
                <ul style={{ 
                  color: theme.colors.text.secondary,
                  paddingLeft: theme.spacing.xl,
                  lineHeight: 1.6,
                }}>
                  <li>Escanee el código de barras de la caja con el lector</li>
                  <li>El código debe tener exactamente 16 dígitos</li>
                  <li>Solo se permiten números (0-9)</li>
                  <li>El sistema validará automáticamente el código</li>
                  <li>Si hay errores, se mostrarán con instrucciones para corregirlos</li>
                </ul>
              </div>
            )}
          </div>
        </MacWindow>

        {/* Información adicional */}
        <MacWindow
          title="Reglas de Validación"
          width="100%"
          height="auto"
          resizable={false}
        >
          <div style={{ padding: theme.spacing.xl }}>
            <div style={infoGridStyles}>
              <div style={infoItemStyles}>
                <div style={infoLabelStyles}>Día de la Semana (pos 0)</div>
                <div style={infoValueStyles}>1-7</div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                  1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb, 7=Dom
                </div>
              </div>

              <div style={infoItemStyles}>
                <div style={infoLabelStyles}>Semana (pos 1-2)</div>
                <div style={infoValueStyles}>01-53</div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                  Semana ISO del año
                </div>
              </div>

              <div style={infoItemStyles}>
                <div style={infoLabelStyles}>Turno (pos 8)</div>
                <div style={infoValueStyles}>1, 2, 3</div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                  1=Mañana, 2=Tarde, 3=Noche
                </div>
              </div>

              <div style={infoItemStyles}>
                <div style={infoLabelStyles}>Calibre (pos 9-10)</div>
                <div style={infoValueStyles}>15 valores</div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                  01-09, 11-16 (no 23)
                </div>
              </div>

              <div style={infoItemStyles}>
                <div style={infoLabelStyles}>Formato (pos 11)</div>
                <div style={infoValueStyles}>1, 2, 3</div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                  1=180u, 2=100 JUMBO, 3=Docena
                </div>
              </div>

              <div style={infoItemStyles}>
                <div style={infoLabelStyles}>Empresa (pos 12)</div>
                <div style={infoValueStyles}>1-5</div>
                <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                  1=Lomas Altas, 2=Santa Marta, etc.
                </div>
              </div>
            </div>
          </div>
        </MacWindow>
      </Container>
    </main>
  );
};

export default CodeValidator;

