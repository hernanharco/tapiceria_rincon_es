// src/App.jsx

import React from 'react';
import { Document } from './components/document/document';
import AppProvider from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Document />
      </div>
    </AppProvider>
  );
}

export default App;