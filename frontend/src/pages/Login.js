import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, User, Mail, ChevronRight, Fingerprint } from 'lucide-react';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'register' : 'login';
    try {
      const res = await axios.post(`https://sentinel-ex.onrender.com/${endpoint}`, form);
      if (res.data.status === "success") {
        navigate('/home');
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Connection Refused: Ensure Backend is Running");
    }
  };

  return (
    <div style={container}>
      <div style={heroSection}>
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <div style={statusBadge}><div style={greenDot} /> NODE_STATUS: ONLINE</div>
          <h1 style={heroTitle}>Cyber Defense<br/><span style={neonText}>That Evolves Daily.</span></h1>
          <p style={heroSub}>Shielding your browser ecosystem through deep manifest<br/> analysis and real-time threat intelligence.</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={glassCard}>
        <div style={cardHeader}>
          <Fingerprint size={45} color="#22c55e" />
          <h2 style={cardTitle}>{isSignup ? "Initialize Profile" : "Terminal Access"}</h2>
          <p style={{color: '#444', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px'}}>SECURITY_PROTOCOL_v4.0</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <AnimatePresence>
            {isSignup && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={inputGroup}>
                <Mail size={18} color="#22c55e" />
                <input type="email" placeholder="Email Address" required onChange={e => setForm({...form, email: e.target.value})} style={inputField} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div style={inputGroup}>
            <User size={18} color="#22c55e" />
            <input type="text" placeholder="Username" required onChange={e => setForm({...form, username: e.target.value})} style={inputField} />
          </div>

          <div style={inputGroup}>
            <Lock size={18} color="#22c55e" />
            <input type="password" placeholder="Passcode" required onChange={e => setForm({...form, password: e.target.value})} style={inputField} />
          </div>

          <button type="submit" style={neonBtn}>
            {isSignup ? "GENERATE CREDENTIALS" : "ESTABLISH LINK"} <ChevronRight size={18} />
          </button>
        </form>

        <p onClick={() => setIsSignup(!isSignup)} style={toggleLink}>
          {isSignup ? "Return to Terminal Login" : "New Auditor? Request Access ID"}
        </p>
      </motion.div>
    </div>
  );
};

// --- NEON CYBER STYLES ---
const container = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8%', background: 'transparent', overflow: 'hidden', position: 'relative', zIndex: 10 };
const heroSection = { maxWidth: '650px' };
const heroTitle = { color: 'white', fontSize: '4.5rem', fontWeight: '900', lineHeight: '1', margin: '20px 0' };
const neonText = { color: '#22c55e', textShadow: '0 0 20px rgba(34, 197, 94, 0.4)' };
const heroSub = { color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.6', fontWeight: '500' };
const statusBadge = { display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontSize: '0.75rem', fontWeight: '900', border: '1px solid #22c55e', width: 'fit-content', padding: '6px 16px', borderRadius: '50px', background: 'rgba(34, 197, 94, 0.05)' };
const greenDot = { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' };
const glassCard = { background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)', padding: '50px', borderRadius: '35px', border: '1px solid rgba(255, 255, 255, 0.1)', width: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' };
const cardHeader = { textAlign: 'center', marginBottom: '35px' };
const cardTitle = { color: 'white', margin: '15px 0 5px 0', fontSize: '1.8rem', fontWeight: '900' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputGroup = { display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '0 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' };
const inputField = { width: '100%', padding: '16px 0', background: 'none', border: 'none', color: 'white', outline: 'none', fontWeight: '600' };
const neonBtn = { width: '100%', padding: '18px', background: '#22c55e', border: 'none', borderRadius: '12px', color: '#050505', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem', marginTop: '10px' };
const toggleLink = { color: '#22c55e', textAlign: 'center', marginTop: '25px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '0.5px' };

export default Login;
