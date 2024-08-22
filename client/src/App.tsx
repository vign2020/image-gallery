import React from 'react'
import Images from './components/Images/Images'
import Upload from './components/Upload/Upload'
import { Route, Routes } from 'react-router-dom'
import Delete  from './components/Delete/Delete'
import Navbar from './components/Navbar/Navbar'
import Update from './components/Update/Update'
export default function App() {
  return (
    <div>
    
        <Routes>
            <Route  path = "/" element={<Images/>}/>
            <Route  path = "/upload" element={<Upload/>}/>
            <Route path="/delete" element={<Delete />}/>
            <Route path="/update/:id" element = {< Update/>}/>
        </Routes>

     
      
    </div>
  )
}
