import { Routes, Route, Navigate } from 'react-router-dom'
import { auth } from './api.js'
import Login from './pages/Login.jsx'
import Shell from './pages/Shell.jsx'

function RequireAuth({ children }) {
  return auth.token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
