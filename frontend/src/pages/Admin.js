import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Shield, Database, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';

const Admin = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('https://sentinel-ex.onrender.com/history')
      .then(res => setLogs(res.data))
      .catch(() => console.log("Database offline"));
  }, []);

  const handleWipe = async () => {
    if (window.confirm("Delete all scan history?")) {
      await axios.delete('https://sentinel-ex.onrender.com/admin/wipe');
      setLogs([]);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 100, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '50px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontWeight: '900', fontSize: '2.5rem' }}>
            Admin <span style={{color: '#22c55e'}}>Dashboard</span>
          </h1>
          <button onClick={handleWipe} style={deleteBtn}>Delete History</button>
        </div>

        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: '#22c55e', borderBottom: '2px solid #333' }}>
                <th style={th}>ID</th>
                <th style={th}>Extension Name</th>
                <th style={th}>Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={td}>#{log.id}</td>
                  <td style={{...td, color: 'white'}}>{log.extension_name}</td>
                  <td style={{...td, color: log.risk_score > 1.5 ? 'red' : '#22c55e'}}>{log.risk_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const deleteBtn = { background: '#ff4d4d', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
const tableWrapper = { background: '#000', borderRadius: '20px', padding: '30px', border: '1px solid #333' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const th = { padding: '15px', fontSize: '0.8rem' };
const td = { padding: '15px', color: '#94a3b8' };

export default Admin;
