import React from 'react'
import Images from './components/Images/Images'
import Upload from './components/Upload/Upload'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <div>

        <Routes>
            <Route  path = "/" element={<Images/>}/>
            <Route  path = "/upload" element={<Upload/>}/>
        </Routes>

     
      
    </div>
  )
}
