import React from 'react';

function TestComponent() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      marginTop: '50px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1>Test Component</h1>
      <p>If you can see this, React is working!</p>
    </div>
  );
}

export default TestComponent;