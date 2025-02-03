import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LuxeEstate from './Landing'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LuxeEstate/>
  </StrictMode>,
)
