import React, { useState } from 'react'
import axios from 'axios'

export default function Delete() {
    
    const [deleteValue , setDeleteValue] = useState<string | undefined>()
    const handleDelete = async ()=>{

        const res = await axios.delete(`http://localhost:3000/images/${deleteValue}`)
        if(res.status === 200 ){
            alert('success')
        }
        else{
            alert('failure')
        }
    }
  return (
    <div>
        <input type="text" value={deleteValue} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setDeleteValue(e.target.value)}} />
        <button onClick={()=>{handleDelete()}}>Click to delete</button>
    </div>
  )
}
