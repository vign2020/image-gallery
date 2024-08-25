import  { useState } from 'react'
import './image.css'
import {  useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import 'react-toastify/dist/ReactToastify.css';

import useHandleGet from '../../hooks/useHandleget';
import useHandleUpdate from '../../hooks/useHandleUpdate';
import useHandleDelete from '../../hooks/useHandleDelete'

export default function Images() {

  const navigate = useNavigate();
  const [modal , setModal] = useState<string>('none')  
  const [deleteValue , setDeleteValue] = useState<string | undefined>()
  const [update , setUpdate] = useState<boolean | undefined>(); 
  const [del , setDelete] = useState<boolean | undefined>(); 


  //custom hooks 
    const  filename =useHandleGet();
                    useHandleUpdate(deleteValue , update);
                    useHandleDelete(deleteValue , del , modal , setModal)

  return (
    <div>
        
      <Navbar/>
   
      <div className='images-main'>

        <div className="title">
          <h1>Have a look at over 10,000 + images from 100+ users</h1>
        </div>

        <div className='images-container'>
          
             {
    filename?
  filename.map((item)=>{
    return(
      <div className='specific-image'>

        
      
      <img src={`http://localhost:52011/${item.filename}`} onClick={()=>{ 
        setModal('flex')
        setDeleteValue(item._id)
        }}/>

        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </div>
    )
  })
  :
  ''
}
          
        </div>


        <div id="modal" className="modal" style={{display : modal}}>
              <div className="modal-content">
              <span className="close-btn" onClick={()=>{setModal('none')}}>&times;</span>
              <h2>click to update or delete</h2>
              {/* <input type="text" /> */}
                <div className="modal-buttons">
                  <button className="btn-update" onClick={()=>{
                    setModal('none')
                    // setUpdateModal('flex')
                    setUpdate(true);
                    navigate(`/update/${deleteValue}`)
                  
                    }}>Update</button>
                  <button className="btn-delete" onClick={()=>{setDelete(true)}}>Delete</button>
                </div>
             </div>
          </div>


        
      </div>
    </div>
  )
}
