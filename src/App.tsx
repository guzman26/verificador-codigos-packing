import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CodeValidator from './views/CodeValidator/CodeValidator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CodeValidator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
