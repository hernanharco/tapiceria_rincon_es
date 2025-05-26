
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { document } from "./components/document"


function App() { 

  return (
    <BrowserRouter>    
      <div className="container mx-auto">
        <Routes>
          <Route path="/document" element={<document /> } />
          <Route path="/" element={<Navigate to="tasks" />} />
          <Route path="/tasks"
            element={
              <Dat_Company isOpen={isOpen} toggleModal={toggleModal} />
            }
          />
        </Routes>              
      </div>
    </BrowserRouter>
  )
}

export default App