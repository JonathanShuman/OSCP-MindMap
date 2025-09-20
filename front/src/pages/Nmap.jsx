import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const Nmap = () => {
  const [ip, setIp] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedScans, setSavedScans] = useState([]);
  const [selectedScanId, setSelectedScanId] = useState('');

  // Load saved scans when component mounts
  useEffect(() => {
    loadSavedScans();
  }, []);

  const loadSavedScans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/nmap`);
      if (response.ok) {
        const data = await response.json();
        setSavedScans(data);
      }
    } catch (error) {
      console.error('Error loading scans:', error);
    }
  };

  const saveScan = async () => {
    if (!ip.trim() || !results.trim()) {
      setError('IP and scan results are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/nmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: ip.trim(),
          command: 'Manual save',
          results: results.trim(),
          scanType: 'custom',
          notes: `Scan for IP: ${ip.trim()}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save scan');
      }
      
      setSuccess('Scan saved successfully!');
      // Clear form
      setIp('');
      setResults('');
      // Reload scans
      loadSavedScans();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving scan:', error);
      setError(`Failed to save: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSelectedScan = (scanId) => {
    const scan = savedScans.find(s => s._id === scanId);
    if (scan) {
      setIp(scan.target);
      setResults(scan.results);
      setSelectedScanId(scanId);
    }
  };

  const deleteScan = async (scanId, event) => {
    // Prevent the click event from bubbling up to the parent div
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this scan?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/nmap/${scanId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete scan');
      }
      
      setSuccess('Scan deleted successfully!');
      
      // If the deleted scan was selected, clear the form
      if (selectedScanId === scanId) {
        setIp('');
        setResults('');
        setSelectedScanId('');
      }
      
      // Reload scans
      loadSavedScans();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting scan:', error);
      setError(`Failed to delete: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      {/* Back to Dashboard button */}
      <Link to="/" className="back-button">
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </Link>

      <div className="nmap-page-container">
        {/* Save Scan Results Section */}
        <div className="nmap-save-section">
          <h2>Nmap Scan Results</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="scan-form">
            <input
              type="text"
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="ip-input"
            />
            
            <textarea
              placeholder="Paste your nmap scan results here..."
              value={results}
              onChange={(e) => setResults(e.target.value)}
              className="nmap-big-textarea"
              rows="20"
            />
            
            <button 
              onClick={saveScan}
              disabled={isLoading || !ip.trim() || !results.trim()}
              className="save-scan-button"
            >
              {isLoading ? 'Saving...' : 'Save Scan'}
            </button>
          </div>
        </div>

        {/* Saved Scans Selector */}
        <div className="saved-scans-section">
          <h2>Saved Scans ({savedScans.length})</h2>
          <div className="scans-selector">
            <select
              value={selectedScanId}
              onChange={(e) => loadSelectedScan(e.target.value)}
              className="scan-selector"
            >
              <option value="">Select a scan to view...</option>
              {savedScans.map((scan) => (
                <option key={scan._id} value={scan._id}>
                  {scan.target} - {new Date(scan.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          
          {/* Scrollable list of saved scans */}
          <div className="saved-scans-list">
            {savedScans.map((scan) => (
              <div 
                key={scan._id} 
                className={`saved-scan-item ${selectedScanId === scan._id ? 'selected' : ''}`}
                onClick={() => loadSelectedScan(scan._id)}
              >
                <div className="scan-header">
                  <span className="scan-target">{scan.target}</span>
                  <div className="scan-actions">
                    <span className="scan-date">
                      {new Date(scan.createdAt).toLocaleDateString()} {new Date(scan.createdAt).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={(e) => deleteScan(scan._id, e)}
                      className="delete-scan-button"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="scan-preview">
                  {scan.results.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nmap Flags Reference - Comprehensive */}
        <div className="nmap-content">
          <h1>Nmap Flags Reference</h1>
          
          {/* Common Command Combinations - Featured at top */}
          <div className="flags-section common-commands">
            <h2>Common Command Combinations</h2>
            <div className="flag-item">
              <code>nmap -sS -sV -O [target]</code>
              <span>Stealth scan with version and OS detection</span>
            </div>
            <div className="flag-item">
              <code>nmap -sS -sV -sC [target]</code>
              <span>Stealth scan with version detection and default scripts</span>
            </div>
            <div className="flag-item">
              <code>nmap -p- -sV -sC [target]</code>
              <span>Full port scan with version detection and scripts</span>
            </div>
            <div className="flag-item">
              <code>nmap -sU --top-ports 1000 [target]</code>
              <span>UDP scan of top 1000 ports</span>
            </div>
            <div className="flag-item">
              <code>nmap -sS -O -sV --script vuln [target]</code>
              <span>Comprehensive vulnerability scan</span>
            </div>
            <div className="flag-item">
              <code>nmap -T4 -A -v [target]</code>
              <span>Fast aggressive scan with verbose output</span>
            </div>
          </div>

          {/* Basic Scanning Techniques */}
          <div className="flags-section">
            <h2>Basic Scanning Techniques</h2>
            <div className="flag-item">
              <code>nmap [target]</code>
              <span>Basic scan of target</span>
            </div>
            <div className="flag-item">
              <code>nmap [target1,target2]</code>
              <span>Scan multiple targets</span>
            </div>
            <div className="flag-item">
              <code>nmap -iL [list.txt]</code>
              <span>Scan targets from file</span>
            </div>
            <div className="flag-item">
              <code>nmap [ip-range]</code>
              <span>Scan range of hosts</span>
            </div>
            <div className="flag-item">
              <code>nmap [ip/cidr]</code>
              <span>Scan entire subnet</span>
            </div>
            <div className="flag-item">
              <code>nmap -iR [number]</code>
              <span>Scan random hosts</span>
            </div>
            <div className="flag-item">
              <code>nmap [targets] --exclude [targets]</code>
              <span>Exclude specific targets</span>
            </div>
            <div className="flag-item">
              <code>nmap [targets] --excludefile [list.txt]</code>
              <span>Exclude targets from file</span>
            </div>
            <div className="flag-item">
              <code>nmap -A [target]</code>
              <span>Aggressive scan (OS, version, script, traceroute)</span>
            </div>
            <div className="flag-item">
              <code>nmap -6 [target]</code>
              <span>Scan IPv6 target</span>
            </div>
          </div>

          {/* Scan Types */}
          <div className="flags-section">
            <h2>Scan Types</h2>
            <div className="flag-item">
              <code>nmap -sS [target]</code>
              <span>SYN scan (stealth, default)</span>
            </div>
            <div className="flag-item">
              <code>nmap -sT [target]</code>
              <span>TCP connect scan</span>
            </div>
            <div className="flag-item">
              <code>nmap -sU [target]</code>
              <span>UDP scan</span>
            </div>
            <div className="flag-item">
              <code>nmap -sA [target]</code>
              <span>ACK scan (detect firewall)</span>
            </div>
            <div className="flag-item">
              <code>nmap -sF [target]</code>
              <span>FIN scan (stealth)</span>
            </div>
            <div className="flag-item">
              <code>nmap -sN [target]</code>
              <span>NULL scan (stealth)</span>
            </div>
            <div className="flag-item">
              <code>nmap -sX [target]</code>
              <span>XMAS scan (stealth)</span>
            </div>
            <div className="flag-item">
              <code>nmap -sW [target]</code>
              <span>Windows scan</span>
            </div>
            <div className="flag-item">
              <code>nmap -sI [zombie] [target]</code>
              <span>Idle zombie scan</span>
            </div>
            <div className="flag-item">
              <code>nmap -sO [target]</code>
              <span>IP protocol scan</span>
            </div>
            <div className="flag-item">
              <code>nmap -sL [target]</code>
              <span>List scan (DNS only)</span>
            </div>
            <div className="flag-item">
              <code>nmap -sR [target]</code>
              <span>RPC scan</span>
            </div>
          </div>

          {/* Port Scanning Options */}
          <div className="flags-section">
            <h2>Port Scanning Options</h2>
            <div className="flag-item">
              <code>nmap -F [target]</code>
              <span>Fast scan (top 100 ports)</span>
            </div>
            <div className="flag-item">
              <code>nmap -p [port(s)] [target]</code>
              <span>Scan specific ports</span>
            </div>
            <div className="flag-item">
              <code>nmap -p [port-name] [target]</code>
              <span>Scan ports by name</span>
            </div>
            <div className="flag-item">
              <code>nmap -sU -sT -p U:[ports],T:[ports] [target]</code>
              <span>Scan ports by protocol</span>
            </div>
            <div className="flag-item">
              <code>nmap -p 1-65535 [target]</code>
              <span>Scan all 65535 ports</span>
            </div>
            <div className="flag-item">
              <code>nmap -p- [target]</code>
              <span>Scan all ports (shorthand)</span>
            </div>
            <div className="flag-item">
              <code>nmap --top-ports [number] [target]</code>
              <span>Scan top N most common ports</span>
            </div>
            <div className="flag-item">
              <code>nmap -r [target]</code>
              <span>Sequential port scan (not random)</span>
            </div>
          </div>

          {/* Discovery Options */}
          <div className="flags-section">
            <h2>Discovery Options</h2>
            <div className="flag-item">
              <code>nmap -sn [target]</code>
              <span>Ping scan only (no port scan)</span>
            </div>
            <div className="flag-item">
              <code>nmap -Pn [target]</code>
              <span>Skip ping (treat all hosts as online)</span>
            </div>
            <div className="flag-item">
              <code>nmap -PS [target]</code>
              <span>TCP SYN ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PA [target]</code>
              <span>TCP ACK ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PU [target]</code>
              <span>UDP ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PY [target]</code>
              <span>SCTP INIT ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PE [target]</code>
              <span>ICMP echo ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PP [target]</code>
              <span>ICMP timestamp ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PM [target]</code>
              <span>ICMP address mask ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PO [target]</code>
              <span>IP protocol ping</span>
            </div>
            <div className="flag-item">
              <code>nmap -PR [target]</code>
              <span>ARP ping (local network)</span>
            </div>
            <div className="flag-item">
              <code>nmap --traceroute [target]</code>
              <span>Trace path to target</span>
            </div>
            <div className="flag-item">
              <code>nmap -R [target]</code>
              <span>Force reverse DNS resolution</span>
            </div>
            <div className="flag-item">
              <code>nmap -n [target]</code>
              <span>Disable reverse DNS resolution</span>
            </div>
            <div className="flag-item">
              <code>nmap --system-dns [target]</code>
              <span>Use system DNS resolver</span>
            </div>
            <div className="flag-item">
              <code>nmap --dns-servers [servers] [target]</code>
              <span>Specify DNS servers</span>
            </div>
          </div>

          {/* Version and OS Detection */}
          <div className="flags-section">
            <h2>Version and OS Detection</h2>
            <div className="flag-item">
              <code>nmap -sV [target]</code>
              <span>Service version detection</span>
            </div>
            <div className="flag-item">
              <code>nmap -sV --version-trace [target]</code>
              <span>Show version detection debug output</span>
            </div>
            <div className="flag-item">
              <code>nmap -O [target]</code>
              <span>OS detection</span>
            </div>
            <div className="flag-item">
              <code>nmap -O --osscan-guess [target]</code>
              <span>Aggressive OS detection</span>
            </div>
            <div className="flag-item">
              <code>nmap --osscan-limit [target]</code>
              <span>Limit OS detection to promising targets</span>
            </div>
          </div>

          {/* Timing Templates */}
          <div className="flags-section">
            <h2>Timing Templates</h2>
            <div className="flag-item">
              <code>nmap -T0 [target]</code>
              <span>Paranoid timing (very slow, IDS evasion)</span>
            </div>
            <div className="flag-item">
              <code>nmap -T1 [target]</code>
              <span>Sneaky timing (slow, IDS evasion)</span>
            </div>
            <div className="flag-item">
              <code>nmap -T2 [target]</code>
              <span>Polite timing (slower, less bandwidth)</span>
            </div>
            <div className="flag-item">
              <code>nmap -T3 [target]</code>
              <span>Normal timing (default)</span>
            </div>
            <div className="flag-item">
              <code>nmap -T4 [target]</code>
              <span>Aggressive timing (fast, reliable networks)</span>
            </div>
            <div className="flag-item">
              <code>nmap -T5 [target]</code>
              <span>Insane timing (very fast, may miss results)</span>
            </div>
          </div>

          {/* Firewall Evasion */}
          <div className="flags-section">
            <h2>Firewall Evasion</h2>
            <div className="flag-item">
              <code>nmap -f [target]</code>
              <span>Fragment packets (8-byte fragments)</span>
            </div>
            <div className="flag-item">
              <code>nmap --mtu [size] [target]</code>
              <span>Specify custom MTU size</span>
            </div>
            <div className="flag-item">
              <code>nmap -D RND:[number] [target]</code>
              <span>Use random decoys</span>
            </div>
            <div className="flag-item">
              <code>nmap -D [decoy1,decoy2] [target]</code>
              <span>Use specific decoys</span>
            </div>
            <div className="flag-item">
              <code>nmap --source-port [port] [target]</code>
              <span>Spoof source port</span>
            </div>
            <div className="flag-item">
              <code>nmap --data-length [size] [target]</code>
              <span>Append random data to packets</span>
            </div>
            <div className="flag-item">
              <code>nmap --randomize-hosts [target]</code>
              <span>Randomize target scan order</span>
            </div>
            <div className="flag-item">
              <code>nmap --spoof-mac [MAC] [target]</code>
              <span>Spoof MAC address</span>
            </div>
            <div className="flag-item">
              <code>nmap --badsum [target]</code>
              <span>Send packets with bad checksums</span>
            </div>
          </div>

          {/* Output Options */}
          <div className="flags-section">
            <h2>Output Options</h2>
            <div className="flag-item">
              <code>nmap -oN [file] [target]</code>
              <span>Normal output to file</span>
            </div>
            <div className="flag-item">
              <code>nmap -oX [file] [target]</code>
              <span>XML output to file</span>
            </div>
            <div className="flag-item">
              <code>nmap -oG [file] [target]</code>
              <span>Grepable output to file</span>
            </div>
            <div className="flag-item">
              <code>nmap -oA [basename] [target]</code>
              <span>Output in all formats</span>
            </div>
            <div className="flag-item">
              <code>nmap -oS [file] [target]</code>
              <span>Script kiddie output</span>
            </div>
            <div className="flag-item">
              <code>nmap --append-output [target]</code>
              <span>Append to output files</span>
            </div>
            <div className="flag-item">
              <code>nmap --stats-every [time] [target]</code>
              <span>Periodic statistics display</span>
            </div>
          </div>

          {/* Scripting Engine */}
          <div className="flags-section">
            <h2>Nmap Scripting Engine (NSE)</h2>
            <div className="flag-item">
              <code>nmap -sC [target]</code>
              <span>Run default scripts</span>
            </div>
            <div className="flag-item">
              <code>nmap --script [script] [target]</code>
              <span>Run specific script</span>
            </div>
            <div className="flag-item">
              <code>nmap --script [category] [target]</code>
              <span>Run scripts by category (auth, brute, default, discovery, dos, exploit, external, fuzzer, intrusive, malware, safe, version, vuln)</span>
            </div>
            <div className="flag-item">
              <code>nmap --script-args [args] [target]</code>
              <span>Pass arguments to scripts</span>
            </div>
            <div className="flag-item">
              <code>nmap --script-trace [target]</code>
              <span>Show script execution trace</span>
            </div>
            <div className="flag-item">
              <code>nmap --script-updatedb</code>
              <span>Update script database</span>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="flags-section">
            <h2>Advanced Options</h2>
            <div className="flag-item">
              <code>nmap --scanflags [flags] [target]</code>
              <span>Custom TCP scan flags</span>
            </div>
            <div className="flag-item">
              <code>nmap --send-eth [target]</code>
              <span>Send raw ethernet frames</span>
            </div>
            <div className="flag-item">
              <code>nmap --send-ip [target]</code>
              <span>Send raw IP packets</span>
            </div>
            <div className="flag-item">
              <code>nmap --privileged [target]</code>
              <span>Assume user is privileged</span>
            </div>
            <div className="flag-item">
              <code>nmap --unprivileged [target]</code>
              <span>Assume user lacks raw socket privileges</span>
            </div>
          </div>

          {/* Debugging and Help */}
          <div className="flags-section">
            <h2>Debugging and Help</h2>
            <div className="flag-item">
              <code>nmap -v [target]</code>
              <span>Verbose output</span>
            </div>
            <div className="flag-item">
              <code>nmap -vv [target]</code>
              <span>Very verbose output</span>
            </div>
            <div className="flag-item">
              <code>nmap -d [target]</code>
              <span>Debug output</span>
            </div>
            <div className="flag-item">
              <code>nmap --reason [target]</code>
              <span>Show reason for port state</span>
            </div>
            <div className="flag-item">
              <code>nmap --open [target]</code>
              <span>Show only open ports</span>
            </div>
            <div className="flag-item">
              <code>nmap --packet-trace [target]</code>
              <span>Show packets sent/received</span>
            </div>
            <div className="flag-item">
              <code>nmap --iflist</code>
              <span>List network interfaces</span>
            </div>
            <div className="flag-item">
              <code>nmap -e [interface] [target]</code>
              <span>Specify network interface</span>
            </div>
            <div className="flag-item">
              <code>nmap -h</code>
              <span>Show help summary</span>
            </div>
            <div className="flag-item">
              <code>nmap -V</code>
              <span>Show version number</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nmap;