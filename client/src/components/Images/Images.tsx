import React, { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from 'react'
import imageone from './assets/imageone.jpeg'
import './image.css'
import { Link } from 'react-router-dom';

export default function Images() {

  const [image , setImage] = useState<string | undefined | unknown>(undefined);
  const length = 15; // Length of the array
  const zeroArray = new Array(length).fill(0);

  const fetch_dummy_image = ()=>{
    return new Promise((resolve ,reject) =>{
      setTimeout(() => {

        resolve(imageone)
      }, 1000);
      
    })
  }
  const get_images = async ()=>{
    const fetchImagesData = await fetch_dummy_image()
    
    setImage(fetchImagesData)
  }

  useEffect(()=>{
    get_images()
  })

  
  return (
    <div>
      <div className='images-main'>
        <div className="navbar">
          
          <div className="search-field">
            
            <input type="text" placeholder='Search by title or user' />
          </div>
          <div className="upload-button">
            <button>
              <Link to="/upload" >
                   <h3 className='upload-link'>Upload new image +</h3>
              </Link>
             
              </button>
          </div>
        </div>

        <div className="title">
          <h1>Have a look at over 10,000 + images from 100+ users</h1>
        </div>

        <div className='images-container'>
          {
            zeroArray.map((item , idx) =>{
              return (
              <>
              { typeof image === 'string' ? <img src={image} alt="" /> : 'Image loading ....'}
              </>
              )
            })
          }
          
        </div>
        
      </div>
    </div>
  )
}
