import { Routes, Route } from 'react-router-dom'
import SharedFavorites from './components/SharedFavorites'

export default function AppRouter({ home }) {
  return (
    <Routes>
      <Route path="/shared" element={<SharedFavorites />} />
      <Route path="*" element={home} />
    </Routes>
  )
}