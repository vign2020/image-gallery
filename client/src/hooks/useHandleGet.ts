
import axios from "axios";
import { useEffect, useState } from "react";

type Info={
    filename : string,
    _id : string
    title : string,
    description : string,
    userName : string
  }

export default function useHandleGet(){

    const [filename , setFilenames] = useState<Info[]>([])

    const getData = async ()=>{
        try{
            const res = await  axios.get("http://localhost:3000/images-test")
            console.log(res.data.fileNames);
            setFilenames(res.data.fileNames)
        }
        catch(e){
            console.log(`Get error is ${e}`)
        }
    

    }

    useEffect(()=>{
        getData();
    },[])

    return filename;
    
  
}