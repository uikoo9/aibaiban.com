import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Board from './pages/Board'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
