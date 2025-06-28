import React from 'react';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflowX: 'hidden',
    }} onClick={onClose}>
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          minWidth: 320,
          maxWidth: 400,
          width: '90vw',
          padding: '1.5rem 1.2rem 2.2rem 1.2rem',
          position: 'relative',
          boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
          maxHeight: '90vh',
          minHeight: 200,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, color: '#800000', cursor: 'pointer' }}>&times;</button>
        {title && <h3 style={{ marginTop: 0, color: '#800000' }}>{title}</h3>}
        <div className="modal-form" style={{ margin: 0, padding: 0, width: '100%', boxSizing: 'border-box', overflowX: 'auto' }}>{children}</div>
      </div>
      <style>{`
        .modal-form input,
        .modal-form textarea,
        .modal-form select {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          margin-bottom: 14px;
          border-radius: 4px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          font-size: 15px;
        }
        .modal-form label {
          font-weight: 500;
          margin-bottom: 2px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Modal; 