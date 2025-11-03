import { useState } from 'react';
import { useUnassignedBoxes } from './useUnassignedBoxes';
import { useActivePallets } from './useActivePallets';

interface DashboardData {
  codeInput: { latestCode: string; history: string[] };
  activePallets: unknown[];
  boxesWithoutPallet: unknown[];
  systemInfo: Record<string, unknown>;
  stats: {
    unassignedBoxes: number;
    activePallets: number;
  };
  loading: boolean;
}

export const useDashboardData = (): DashboardData => {
  const { data: unassignedBoxes, loading: loadingBoxes } = useUnassignedBoxes();
  const { data: activePallets, loading: loadingPallets } = useActivePallets();

  const [data] = useState<DashboardData['codeInput']>({
    latestCode: '',
    history: [],
  });

  return {
    codeInput: data,
    activePallets: activePallets || [],
    boxesWithoutPallet: unassignedBoxes || [],
    systemInfo: {},
    stats: {
      unassignedBoxes: unassignedBoxes?.length || 0,
      activePallets: activePallets?.length || 0,
    },
    loading: loadingBoxes || loadingPallets,
  };
};
