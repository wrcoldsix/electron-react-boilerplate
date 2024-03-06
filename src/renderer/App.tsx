import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import Hello from '../routes/hello';
import AutoCreatContent from '@/routes/autoCreateContent/auto_create_content';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AutoCreatContent />} />
      </Routes>
    </Router>
  );
}
