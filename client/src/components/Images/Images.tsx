import React, { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react'
import imageone from './assets/imageone.jpeg'
import axios from 'axios'
import './image.css'
import { Link, redirect, useNavigate } from 'react-router-dom';
import DragnDrop from '../DragnDrop/DragnDrop';
import Navbar from '../Navbar/Navbar';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { Navigate } from 'react-router-dom';


type Info={
  //fileName
  filename : string,
  //id
  _id : string
  title : string,
  description : string,
  userName : string
}
export default function Images() {

  const navigate = useNavigate();

  const [image , setImage] = useState<string | undefined | unknown>(undefined);
  const [filename , setFilenames] = useState<Info[]>([])

  const [modal , setModal] = useState<string>('none')  
  const [updateModal , setUpdateModal] = useState('none')
  const [deleteValue , setDeleteValue] = useState<string | undefined>()
  const [acceptedFiles , setAcceptedFiles] = useState()
  const [status , setStatus] = useState<number | undefined>()

  const [updateFiles , setUpdateFiles] = useState()
 
  
  // const [updateValue , setUpdateValue] = useState<string | undefined>() 

  const length = 15; // Length of the array
  // const zeroArray = new Array(length).fill(0);

  // const fetch_dummy_image = ()=>{
  //   return new Promise((resolve ,reject) =>{
  //     setTimeout(() => {

  //       resolve(imageone)
  //     }, 1000);
      
  //   })
  // }
  // const get_images = async ()=>{
  //   const fetchImagesData = await fetch_dummy_image()
    
  //   setImage(fetchImagesData)
  // }

  // useEffect(()=>{
  //   get_images()
  // },[])

  const getImages = async ()=>{
    
    const res = await  axios.get("http://localhost:3000/images-test")
    
    console.log(res.data.fileNames);
    setFilenames(res.data.fileNames)
    
  
  }

  const handleUpdate = async ()=>{
    const formData = new FormData();
    acceptedFiles ? formData.append('file', acceptedFiles[0]) : ' '; // assuming acceptedFiles is an array
    console.log('delete values ' + deleteValue )
    try {
        const res = await axios.patch(`http://localhost:3000/images/${deleteValue}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setStatus(res.status)
 

    } catch (e) {
        console.error(e);
    }
  }
  const handleDelete = async ()=>{

    const res = await axios.delete(`http://localhost:3000/images/${deleteValue}`)
    
    setModal('none')
    window.location.reload();
}

useEffect(()=>{
  if(acceptedFiles) handleUpdate()
},[updateFiles])



  useEffect(()=>{
    getImages()
  },[])
  
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
  filename.map((item, idx)=>{
    return(
      <div className='specific-image'>
      
      <img src={`http://localhost:53877/${item.filename}`} onClick={()=>{
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
                    setUpdateModal('flex')
                    navigate(`/update/${deleteValue}`)
                  
                    }}>Update</button>
                  <button className="btn-delete" onClick={()=>{handleDelete()}}>Delete</button>
                </div>
             </div>
          </div>

          <div id="modal" className="modal" style={{display : updateModal}} >
          {/* <DragnDrop status={status} setAcceptedFiles={setAcceptedFiles} setUpdateFiles={setUpdateFiles} update={true} /> */}

          </div>

        
      </div>
    </div>
  )
}
