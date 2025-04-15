
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Navigation } from './components/Navigation'
import { Toaster } from 'react-hot-toast'
import { CompanyModal } from "./components/modals/companyModal"
import { Dat_Company } from "./components/dat_company"
import { useToggle } from "./hooks/useToggle"


function App() {

  // Usa el custom hook para controlar el estado del modal
  const [isOpen, toggleModal] = useToggle(false);

  return (
    <BrowserRouter>
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="tasks" />} />
          <Route path="/tasks"
            element={
              <Dat_Company isOpen={isOpen} toggleModal={toggleModal} />
            }
          />
        </Routes>
        {/* Renderiza el modal solo si está abierto */}
        {isOpen && <CompanyModal isOpen={isOpen} toggleModal={toggleModal} />}
        <Toaster /> 
      </div>
    </BrowserRouter>
  )
}

export default App