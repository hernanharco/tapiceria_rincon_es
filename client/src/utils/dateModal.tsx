
import React, { useState } from 'react';

const DateModal = ({ isOpen, onClose, onSave, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedDate) {
      alert('Por favor, selecciona una fecha');
      return;
    }
    onSave(selectedDate); // Llama a la función de guardado con la fecha
    onClose(); // Cierra el modal
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3>Selecciona una fecha</h3>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />

        <div style={styles.buttonContainer}>
          <button onClick={handleSave} style={styles.saveButton}>
            Guardar
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Estilos simples para el modal
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  dateInput: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default DateModal;