import { RouterProvider } from 'react-router-dom'
import { useRouter } from './hooks/useRouter'
import { ThemeProvider } from './context/ThemeContext'

export function App() {
  const routes = useRouter()
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}
