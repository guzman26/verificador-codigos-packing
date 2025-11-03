import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTerminal from './views/MainTerminal/MainTerminal';
import CreatePallet from './views/CreatePallet/CreatePallet';
import CodeValidator from './views/CodeValidator/CodeValidator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainTerminal />} />
        <Route path="/create-pallet" element={<CreatePallet />} />
        <Route path="/validate-code" element={<CodeValidator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
