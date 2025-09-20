import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Key, Globe } from 'lucide-react';
import CredsModal from '../components/CredsModal';

const Dashboard = () => {
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black">
      <button
        onClick={() => setIsCredsModalOpen(!isCredsModalOpen)}
        className="creds-button"
      >
        <Key className="w-5 h-5" />
      </button>

      <Link to="/nmap" className="nmap-button">
        Nmap
      </Link>

      <Link to="/webappexploit" className="webapp-button">
        <Globe className="w-5 h-5" />
        Web App Exploit
      </Link>

      <CredsModal 
        isOpen={isCredsModalOpen}
        onClose={() => setIsCredsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;