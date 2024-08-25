import { useEffect } from "react";
import axios from "axios";

export default function useHandleDelete(deleteValue:string | undefined ,  del : boolean | undefined , modal : string , setModal :  React.Dispatch<React.SetStateAction<string>>) {  
    

    const handleDelete = async ()=>{

        await axios.delete(`http://localhost:3000/images/${deleteValue}`)
        
        setModal('none')
        window.location.reload();
    }
   

    useEffect(()=>{
        if(deleteValue) handleDelete();
    },[del])
    return modal;

}
