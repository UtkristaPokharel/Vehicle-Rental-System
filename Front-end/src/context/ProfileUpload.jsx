import { useRef } from "react";
import { LuCloudUpload } from "react-icons/lu";

export default function ProfileImageUpload(){
  
    const fileInputRef =useRef ();
  
  const handleClick=()=>{
    fileInputRef.current.click()
  }

  return(
    <>
    <div className="absolute top-19  ">

      <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      onChnage={(e)=>console.log(e.target.files[0])}
      />

      <button
       onClick={handleClick} 
      className="text-gray-400 p-4  rounded-full  "
     >
         <LuCloudUpload className="text-3xl"/>
      </button>
    </div>
    
    </>
  )
}