import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut, Layout, History, Settings, Info } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <div style={logoSection} onClick={() => navigate('/home')}>
        <Shield color="#00ff66" size={28} />
        <span style={logoText}>SENTINEL<span style={{color: '#00ff66'}}>-EX</span></span>
      </div>

      <div style={linkSection}>
        <NavLink to="/home" icon={<Layout size={18}/>} label="DASHBOARD" />
        <NavLink to="/history" icon={<History size={18}/>} label="HISTORY" />
        <NavLink to="/admin" icon={<Settings size={18}/>} label="ADMIN" />
        <NavLink to="/about" icon={<Info size={18}/>} label="ABOUT" />
        
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: '#ff0033', color: 'white' }}
          onClick={() => navigate('/')}
          style={logoutBtn}
        >
          <LogOut size={18} /> LOGOUT
        </motion.button>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <motion.div 
      whileHover={{ y: -2, color: '#00ff66' }}
      style={navLinkStyle}
    >
      {icon} <span style={{fontSize: '0.75rem', fontWeight: '900'}}>{label}</span>
      <motion.div initial={{ width: 0 }} whileHover={{ width: '100%' }} style={underline} />
    </motion.div>
  </Link>
);

// --- STYLES ---
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(5, 5, 5, 0.95)', borderBottom: '1px solid rgba(0, 255, 102, 0.2)', position: 'sticky', top: 0, zIndex: 1000 };
const logoSection = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const logoText = { color: 'white', fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-1px' };
const linkSection = { display: 'flex', alignItems: 'center', gap: '30px' };
const navLinkStyle = { color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', transition: '0.3s' };
const underline = { height: '2px', background: '#00ff66', position: 'absolute', bottom: '-5px', left: 0 };
const logoutBtn = { background: 'rgba(255, 0, 51, 0.1)', color: '#ff0033', border: '1px solid #ff0033', padding: '8px 20px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' };

export default Navbar;