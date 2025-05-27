// src/App.jsx

import { Document } from './components/document/document';
import { CompanyProvider } from './context/CompanyProvider';
import { ClientsProvider } from './context/ClientsProvider';

function App() {
  return (
    <CompanyProvider>
    <ClientsProvider>
      <div className="App">
        <Document />
      </div>
    </ClientsProvider>
    </CompanyProvider>
  );
}

export default App;