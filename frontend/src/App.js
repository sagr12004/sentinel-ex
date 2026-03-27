import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Activity, ShieldCheck, ShieldAlert, Fingerprint, Zap, ShieldQuestion } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Navbar from './components/Navbar';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('https://sentinel-ex.onrender.com/analyze', formData);
      setResult(res.data);
    } catch (e) { alert("Scanner Offline"); } finally { setLoading(false); }
  };

  const PIE_COLORS = ['#22c55e', '#ef4444', '#f97316', '#3b82f6'];

  const getMitigation = (perm) => {
    const db = {
      "cookies": "Risk: Session hijacking. Mitigation: Clear cookies regularly or use HTTP-only flags.",
      "history": "Risk: Privacy leak. Mitigation: Isolate extension site access to specific domains.",
      "<all_urls>": "EXTREME RISK: Can read data on every site. Mitigation: Revoke universal access.",
      "tabs": "Risk: User tracking. Mitigation: Monitor for background network spikes."
    };
    return db[perm] || "Standard monitoring: Ensure the developer is verified and reputable.";
  };

  return (
    <div style={{ minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <main style={mainLayout}>
        
        {!result ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={centeredScanner}>
            <div style={badge}><div style={greenDot} /> SCANNER_ACTIVE</div>
            <h2 style={scannerTitle}>INITIALIZE <span style={{color: '#22c55e'}}>DEEP_SCAN</span></h2>
            <div style={miniDropzone}>
              <Upload size={30} color="#22c55e" />
              <input type="file" onChange={(e) => setFile(e.target.files[0])} style={fileInput} />
            </div>
            <button onClick={handleUpload} style={scanBtn}>{loading ? "DECRYPTING..." : "START SCAN"}</button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={resultsContainer}>
              
              {/* --- TOP ROW: Score & Charts --- */}
              <div style={topRow}>
                <div style={resultCard}>
                   <div style={label}><Zap size={14}/> SECURITY_GRADE</div>
                   <div style={{...bigGrade, color: result.score > 1.5 ? '#ef4444' : '#22c55e'}}>
                      {result.score > 1.5 ? 'F' : 'A+'}
                   </div>
                   <div style={riskBox(result.score > 1.5)}>
                      {result.score > 1.5 ? 'HIGH RISK DETECTED' : 'SYSTEM SECURED'}
                   </div>
                </div>

                <div style={resultCard}>
                  <div style={label}><Activity size={14}/> THREAT_PULSE_LINE</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={result.permissions}>
                      <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} dot={{fill: '#22c55e'}} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={resultCard}>
                  <div style={label}>PERMISSION_DISTRIBUTION</div>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={result.permissions} innerRadius={40} outerRadius={60} dataKey="weight">
                        {result.permissions.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % 4]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* --- BOTTOM ROW: Threat Matrix --- */}
              <h3 style={sectionTitle}><Fingerprint color="#22c55e" /> THREAT_MATRIX</h3>
              <div style={matrixGrid}>
                {result.permissions.map((p, i) => (
                  <div key={i} style={permCard(p.weight > 0.6)}>
                    <div style={permHeader}>
                      <span style={{fontWeight: 'bold'}}>{p.name}</span>
                      <span style={pctBadge(p.weight > 0.6)}>{(p.weight * 100).toFixed(0)}%</span>
                    </div>
                    <div style={mitigationText}>
                      <ShieldQuestion size={12} color="#22c55e" style={{marginRight: '5px'}}/>
                      {getMitigation(p.name)}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setResult(null)} style={resetBtn}>NEW ANALYSIS</button>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

// --- STYLES ---
const mainLayout = { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 };
const centeredScanner = { background: 'rgba(10,10,10,0.9)', padding: '40px', borderRadius: '30px', border: '1px solid #22c55e', width: '400px', margin: '100px auto', textAlign: 'center', boxShadow: '0 0 30px rgba(34,197,94,0.2)' };
const scannerTitle = { fontSize: '1.5rem', fontWeight: '900', margin: '20px 0' };
const miniDropzone = { border: '1px dashed #22c55e', padding: '20px', borderRadius: '15px', marginBottom: '20px' };
const scanBtn = { background: '#22c55e', color: 'black', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', width: '100%' };
const badge = { display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.7rem', fontWeight: 'bold', justifyContent: 'center' };
const greenDot = { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' };

const resultsContainer = { display: 'flex', flexDirection: 'column', gap: '30px' };
const topRow = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' };
const resultCard = { background: 'rgba(10,10,10,0.95)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' };
const bigGrade = { fontSize: '4rem', fontWeight: '900', textAlign: 'center', margin: '10px 0' };
const riskBox = (isRisk) => ({ background: isRisk ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: isRisk ? '#ef4444' : '#22c55e', padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 'bold', border: `1px solid ${isRisk ? '#ef4444' : '#22c55e'}` });

const matrixGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const permCard = (isRisk) => ({ background: '#0a0a0a', padding: '20px', borderRadius: '15px', border: `1px solid ${isRisk ? '#ef4444' : '#333'}`, position: 'relative' });
const pctBadge = (isRisk) => ({ color: isRisk ? '#ef4444' : '#22c55e', fontWeight: 'bold', fontSize: '0.8rem' });
const mitigationText = { marginTop: '15px', fontSize: '0.75rem', color: '#888', lineHeight: '1.4', display: 'flex', alignItems: 'flex-start' };

const label = { color: '#666', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' };
const sectionTitle = { fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' };
const permHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const resetBtn = { background: 'none', border: '1px solid #22c55e', color: '#22c55e', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', alignSelf: 'center' };
const tooltipStyle = { background: '#000', border: '1px solid #22c55e', color: '#fff', fontSize: '0.7rem' };
const fileInput = { color: '#444', fontSize: '0.7rem', marginTop: '10px' };

export default App;
