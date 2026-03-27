import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Database, Shield, ChevronRight, Activity, Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';

const HistoryPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://sentinel-ex.onrender.com/history').then(res => setData(res.data));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <Navbar />
      <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={header}>
          <h1 style={title}><Terminal color="#00ff66" size={32}/> AUDIT_ARCHIVES</h1>
          <div style={badge}>DATABASE_NODES: {data.length}</div>
        </div>

        <div style={grid}>
          {data.map((log) => (
            <motion.div key={log.id} whileHover={{ y: -5, borderColor: '#00ff66' }} style={cyberCard}>
              <div style={cardTop}>
                <div style={iconBox}><Database color="#00ff66" size={20}/></div>
                <div style={scoreText(log.risk_score)}>{log.risk_score}</div>
              </div>
              <h3 style={logTitle}>{log.extension_name}</h3>
              <p style={logId}>LOG_ID: {log.id} • SECURED_ENTRY</p>
              <button style={actionBtn}>DECRYPT_RECORD <ChevronRight size={14}/></button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const title = { color: 'white', fontSize: '2.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px' };
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' };
const badge = { background: 'rgba(0,255,102,0.1)', color: '#00ff66', padding: '5px 15px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '900', border: '1px solid #00ff66' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
const cyberCard = { background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: '0.3s' };
const cardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const iconBox = { background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' };
const scoreText = (s) => ({ color: s > 1.5 ? '#ff0033' : '#00ff66', fontWeight: '900', fontSize: '1.5rem' });
const logTitle = { color: 'white', margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: '800' };
const logId = { color: '#444', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px' };
const actionBtn = { background: 'none', border: 'none', color: '#00ff66', fontWeight: '900', fontSize: '0.7rem', marginTop: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };

export default HistoryPage;
