
import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import axios from 'axios'
import './upload.css'
import { useNavigate  } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import DragnDrop from '../DragnDrop/DragnDrop';





export default function Upload() {


  
let navigate = useNavigate();

  const [filename , setFilenames] = useState<string[]>([])
  const [status , setStatus] = useState<number | undefined>()
  
  const [updateFiles , setUpdateFiles] = useState()

  //setting a new state
  const [acceptedFiles , setAcceptedFiles] = useState()


  
  const [title ,setTitle] = useState<string >('');
  const [desc , setDesc] = useState<string >('');



  const handleFileSubmit = async () => {
    const formData = new FormData();
    acceptedFiles ? formData.append('file', acceptedFiles[0]) : ' '; // assuming acceptedFiles is an array

    //append title , username and descripotion
    formData.append('title' ,  title)
    formData.append('description' , desc);
    formData.append('userName' , 'Vignesh')

    try {
        const res = await axios.post('http://localhost:3000/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setStatus(res.status)
        // console.log(res.data.fileNames);
        // setFilenames([res.data.fileNames])
    } catch (e) {
        console.error(e);
    }
};

useEffect(()=>{
  if(acceptedFiles) handleFileSubmit()
},[acceptedFiles])

  return (
    

  <div>
 
  <Navbar/>
  <div className='container-wrapper'>
 
    <DragnDrop status={status} setAcceptedFiles={setAcceptedFiles} update={false} setUpdateFiles={setUpdateFiles} setTitle={setTitle} setDesc={setDesc} />
  </div>

  </div>
  
  )
}
