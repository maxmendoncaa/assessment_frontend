"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  card: {
    textAlign: 'center',
    padding: '2rem',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    maxWidth: '400px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '300',
    color: '#dc3545',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  message: {
    color: '#6c757d',
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
  },
};

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div 
        // @ts-ignore
      style={styles.card}>
        <h1 style={styles.title}>
          Access<br />Denied
        </h1>
        <p style={styles.message}>
          You are not authorized to access this page.
        </p>
        <button 
          style={styles.button}
          onClick={() => router.push('/')}
        >
          Go Back to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;