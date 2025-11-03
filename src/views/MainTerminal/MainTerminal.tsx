import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import { Container, Button, MacWindow } from '../../components/ui';
import { Plus, ScanBarcode, Activity } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useDashboardData } from '../../hooks/useDashboardData';

const MainTerminal: React.FC = () => {
  const { stats } = useDashboardData();

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <Container maxWidth="xl" padding={false}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Terminal de Control</h1>
              <div style={styles.stats}>
                <StatBadge icon={<Activity size={14} />} label="Cajas sin asignar" value={stats?.unassignedBoxes || 0} />
                <StatBadge label="Pallets activos" value={stats?.activePallets || 0} />
              </div>
            </div>
            <div style={styles.actions}>
              <Link to="/validate-code" style={{ textDecoration: 'none' }}>
                <Button icon={<ScanBarcode size={20} />} size="large" variant="secondary">
                  Validar Código
                </Button>
              </Link>
              <Link to="/create-pallet" style={{ textDecoration: 'none' }}>
                <Button icon={<Plus size={20} />} size="large">
                  Crear Pallet
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <Container maxWidth="xl" style={styles.content}>
        <MacWindow title="Dashboard de Control" width="100%" height="auto" resizable={false}>
          <Dashboard />
        </MacWindow>
      </Container>
    </main>
  );
};

const StatBadge: React.FC<{ icon?: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div style={styles.statBadge}>
    {icon}
    <span style={styles.statLabel}>{label}:</span>
    <span style={styles.statValue}>{value}</span>
  </div>
);

const styles = {
  main: {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary,
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,

  header: {
    backgroundColor: theme.colors.background.blur,
    backdropFilter: `blur(${theme.blur.xl})`,
    WebkitBackdropFilter: `blur(${theme.blur.xl})`,
    borderBottom: `1px solid ${theme.colors.border.light}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: `${theme.spacing.lg} 0`,
  } as React.CSSProperties,

  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.xl,
  } as React.CSSProperties,

  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    margin: 0,
    marginBottom: theme.spacing.sm,
  } as React.CSSProperties,

  stats: {
    display: 'flex',
    gap: theme.spacing.lg,
    alignItems: 'center',
  } as React.CSSProperties,

  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
  } as React.CSSProperties,

  statLabel: {
    color: theme.colors.text.secondary,
  } as React.CSSProperties,

  statValue: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  } as React.CSSProperties,

  actions: {
    display: 'flex',
    gap: theme.spacing.md,
  } as React.CSSProperties,

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing['3xl'],
  } as React.CSSProperties,
};

export default MainTerminal;
