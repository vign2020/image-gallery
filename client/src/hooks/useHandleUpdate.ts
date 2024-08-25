
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function useHandleUpdate(deleteValue:string |undefined , update: boolean|undefined){
    const [acceptedFiles] = useState()
    // const [deleteValue , setDeleteValue] = useState<string | undefined>()
    const [status , setStatus] = useState<number | undefined>()



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

      useEffect(()=>{
        if(update) handleUpdate();
      },[update])

      return status;
}