import React from 'react'
import { useCallback , useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Navigate, useNavigate } from 'react-router-dom'
import './DragnDrop.css'

type DragProps={
    // filename : string[],
    // setFilenames :  React.Dispatch<React.SetStateAction<string[]>>,
    status : number | undefined ,
    // setStatus : React.Dispatch<React.SetStateAction<number | undefined>>,
    setAcceptedFiles : React.Dispatch<React.SetStateAction<undefined>>,
    setUpdateFiles : React.Dispatch<React.SetStateAction<undefined>>,
    update : boolean,
    
    setTitle : React.Dispatch<React.SetStateAction<string >>,
    setDesc :  React.Dispatch<React.SetStateAction<string>>,
 

}
const DragnDrop : React.FC<DragProps> = ({ status , setAcceptedFiles , setUpdateFiles , update , setTitle , setDesc })=>{

    const navigate = useNavigate();

     
  const onDrop = useCallback((acceptedFiles : any) => {
    console.log(acceptedFiles)
    if(!update) setAcceptedFiles(acceptedFiles)
    else setUpdateFiles(acceptedFiles)
    
    
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


  return (
    <div>

<div className="container">

<div {...getRootProps()} className={`drag-drop-box ${isDragActive ? 'drag-active' : ''}`}>
  <input {...getInputProps()} />
  {isDragActive ? (
    <p>Drop the files here ...</p>
  ) : (
    <p>Drag 'n' drop some files here, or click to select files</p>
  )}
</div>

<label htmlFor="">Enter A title</label>
<input type="text" onChange={(e)=>{setTitle(e.target.value)}}/>

<label htmlFor="">Enter a descripotion</label>
<input type="text" onChange={(e)=>{setDesc(e.target.value)}}/>

<div className='show-message'>
  {status === 201 ? (
    <h1 className="success">Image has been uploaded successfully :)</h1>
  ) : (
    status === 501 ? <h1 className="error">Some problem in uploading</h1> : ''
  )}
</div>

<button onClick={()=>{navigate('/')}} className='button-click-all'>Click to see all images</button>

</div>

        

    </div>
  )
}

export default DragnDrop