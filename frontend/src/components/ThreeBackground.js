import React, { Suspense } from 'react';
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const ThreeBackground = () => {
  return (
    <div style={containerStyle}>
      <Suspense fallback={<div style={{background: '#050505', width: '100vw', height: '100vh'}} />}>
        <Spline scene="https://prod.spline.design/ewZUXoKjKz4TIugF/scene.splinecode" />
      </Suspense>
    </div>
  );
};

const containerStyle = { 
  position: 'fixed', 
  top: 0, left: 0, 
  width: '100vw', height: '100vh', 
  zIndex: -1, 
  overflow: 'hidden',
  background: '#050505' 
};

export default ThreeBackground;