import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import BoardAntd from './pages/BoardAntd'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoardAntd />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
