import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type = 'error', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);
  
  if (!message) return null;
  
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span>{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Toast; 
