import React, { useState } from 'react'
import axios from 'axios'
import DragnDrop from '../DragnDrop/DragnDrop'


import { useParams } from 'react-router-dom';

import './Update.css'





export default function Update() {

  const { id } = useParams(); 
    
  
  const [updateFiles , setUpdateFiles] = useState()
  const [acceptedFiles , setAcceptedFiles] = useState()
    
  const [title ,setTitle] = useState<string >('');
  const [desc , setDesc] = useState<string >('');
  const [status , setStatus] = useState<number | undefined>()

  // const [UpdateId , setUpdateId] = useState<string | undefined>(id)


  const handleUpdate = async () => {
    const formData = new FormData();
    acceptedFiles ? formData.append('file', acceptedFiles[0]) : ' '; // assuming acceptedFiles is an array

    //append title , username and descripotion
    formData.append('title' ,  title)
    formData.append('description' , desc);
    formData.append('userName' , 'Vignesh')

    try {
        const res = await axios.patch(`http://localhost:3000/images/${id}`, formData, {
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


  return (
   
   
        <div className="update-container">
             <h1>The image that you had clicked on will be updated</h1>
        <DragnDrop status={status} setAcceptedFiles={setAcceptedFiles} update={false} setUpdateFiles={setUpdateFiles} setTitle={setTitle} setDesc={setDesc} />
        </div>
   
  )
}
