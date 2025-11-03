import { lazy } from 'react';

const MainTerminal = lazy(() => import('../views/MainTerminal/MainTerminal'));
const CreatePallet = lazy(() => import('../views/CreatePallet/CreatePallet'));
const CodeValidator = lazy(() => import('../views/CodeValidator/CodeValidator'));

export const routes = [
  {
    path: '/',
    element: <MainTerminal />,
  },
  {
    path: '/create-pallet',
    element: <CreatePallet />,
  },
  {
    path: '/validate-code',
    element: <CodeValidator />,
  },
];