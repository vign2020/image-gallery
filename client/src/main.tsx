import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import './index.css'

import { ToastContainer, toast } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <App /> 
       
    </BrowserRouter>
    {/* <ToastContainer /> */}

  </StrictMode>,
)
