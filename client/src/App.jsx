
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Navigation } from './components/Navigation'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="tasks" />} />
          <Route path="/tasks" element={<Navigate/>}/>          
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App