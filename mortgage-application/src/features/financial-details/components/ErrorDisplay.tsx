import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { clearError } from '../slices/errorSlice';

const ErrorDisplay: React.FC = () => {
  const { hasError, errorMessage } = useSelector((state: RootState) => state.error);
  const dispatch = useDispatch();

  if (!hasError) return null;

  return (
    <div className="error-container" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '15px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 1000,
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>Error</strong>
        <button 
          onClick={() => dispatch(clearError())}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          &times;
        </button>
      </div>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorDisplay;
