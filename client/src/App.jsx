// src/App.jsx

import { Document } from './components/document/document';
import { DataCompanyProvider } from './context/DataCompanyProvider';

function App() {
  return (
    <DataCompanyProvider>
      <div className="App">
        <Document />
      </div>
    </DataCompanyProvider>
  );
}

export default App;