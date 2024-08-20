
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import './upload.css'

export default function Upload() {

 
  const onDrop = useCallback((acceptedFiles: unknown) => {
   
    console.log(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div>

<div {...getRootProps()} className={`drag-drop-box ${isDragActive ? 'drag-active' : ''}`}>
  <input {...getInputProps()} />
  {isDragActive ? (
    <p>Drop the files here ...</p>
  ) : (
    <p>Drag 'n' drop some files here, or click to select files</p>
  )}
</div>

    </div>
  )
}
