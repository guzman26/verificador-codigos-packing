import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import CodeInputWidget from '../Widgets/CodeInputWidget/CodeInputWidget';
import { useCreateBox } from '../../hooks/useCreateBox';
import ActivePalletsWidget from '../Widgets/ActivePalletsWidget/ActivePalletsWidget';
import UnassignedBoxesWidget from '../Widgets/UnassignedBoxesWidget/UnassignedBoxesWidget';

const Dashboard: React.FC = () => {
  const [codeData, setCodeData] = useState({ latestCode: '', history: [] as string[] });
  const { submit: processCode } = useCreateBox();

  const handleCodeSubmit = (code: string) => {
    setCodeData(prev => ({
      latestCode: code,
      history: [code, ...prev.history].slice(0, 10)
    }));
  };

  return (
    <section>
      <SectionTitle>Operaciones Principales</SectionTitle>
      <div style={{ ...styles.grid, marginBottom: theme.spacing['2xl'] }}>
        <div style={styles.wideColumn}>
          <CodeInputWidget 
            data={codeData} 
            onCodeSubmit={handleCodeSubmit}
            onProcessCode={processCode}
          />
        </div>
      </div>

      <SectionTitle>Gestión de Inventario</SectionTitle>
      <div style={styles.grid}>
        <UnassignedBoxesWidget />
        <div style={styles.wideColumn}>
          <ActivePalletsWidget />
        </div>
      </div>
    </section>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={styles.sectionTitle}>{children}</h2>
);

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing.lg,
    width: '100%',
  } as React.CSSProperties,

  wideColumn: {
    gridColumn: 'span 2',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  } as React.CSSProperties,
};

export default Dashboard;
