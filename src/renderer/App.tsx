import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/routes/home/home';
import './App.css';
import MoneyCal from '@/routes/moneyCal/moneyCal';
import ProjectReim from '@/routes/projectReim/projectReim';
import ProjectCost from '@/routes/projectCost/projectCost';

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/moneyCal" element={<MoneyCal />} />
      <Route path="/projectReim" element={<ProjectReim />} />
      <Route path="/projectCost" element={<ProjectCost />} />
    </Routes>
  );
}
