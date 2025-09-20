import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Nmap from './pages/Nmap';
import WebAppExploit from './pages/WebAppExploit';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/nmap" element={<Nmap />} />
        <Route path="/webappexploit" element={<WebAppExploit />} />
      </Routes>
    </Router>
  );
}

export default App;
