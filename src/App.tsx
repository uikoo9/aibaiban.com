import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import Board from './pages/Board'
import BoardAntd from './pages/BoardAntd'
import Demo from './pages/Demo'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/board/:id" element={<Board />} />
          <Route path="/antd" element={<BoardAntd />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
