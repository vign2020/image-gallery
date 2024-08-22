import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <div>

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
          <div className="upload-button">
            <button>
              <Link to="/account" >
                   <h3 className='upload-link'>Go to my account</h3>
              </Link>
             
              </button>
          </div>
        </div>
    </div>
  )
}
