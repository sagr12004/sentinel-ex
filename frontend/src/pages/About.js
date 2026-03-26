import React from 'react';
import { Shield, Search, CheckCircle, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div style={{ position: 'relative', zIndex: 100, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <Shield size={60} color="#22c55e" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '900' }}>
          About <span style={{color: '#22c55e'}}>Sentinel-Ex</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '50px' }}>Simple browser security audits for everyone.</p>

        <div style={grid}>
          <Box title="Smart Scanning" desc="We scan extension files to see exactly what data they can access." />
          <Box title="Safety Grades" desc="Get a clear grade from A+ to F so you know which extensions are safe." />
          <Box title="Privacy Protection" desc="Stop extensions from silently reading your cookies and history." />
        </div>
      </div>
    </div>
  );
};

const Box = ({ title, desc }) => (
  <div style={{ background: '#000', padding: '30px', borderRadius: '20px', border: '1px solid #333', textAlign: 'left' }}>
    <h3 style={{ color: 'white', marginBottom: '10px' }}>{title}</h3>
    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{desc}</p>
  </div>
);

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' };

export default About;