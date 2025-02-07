import { colors, getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useRef, useState } from 'react';
import {IoArrowBack} from 'react-icons/io5';
import {FaPlus,FaTrash} from 'react-icons/fa'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const navigate=useNavigate();
  const {userInfo,setUserInfo}=useAppStore();
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [image,setImage]=useState(null);
  const [hovered,setHovered]=useState(false);
  const [selectedColor,setSelectCoolor]=useState(0);
const fileInputRef=useRef(null);


useEffect(()=>{
console.log("user info profile",userInfo.profileSetup)
  if(userInfo.profileSetup){
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setSelectCoolor(userInfo.color);
  }
if(userInfo.image){
  setImage(`${HOST}/${userInfo.image}`);
}

},[userInfo]);

const validateProfile=()=>{
  if(!firstName){
    toast.error("First name is required.")
    return false;
  }
  if(!lastName){
    toast.error("Last name is required.");
    return false;
  }
  return true;
}

  const saveChanges=async()=>{
    console.log(validateProfile());
if(validateProfile()){
  try{
console.log("before response");
    const response=await apiClient.post(UPDATE_PROFILE_ROUTE,
      {firstName,
        lastName,
        color:selectedColor},
      {withCredentials:true}
    )
    console.log("Response while save change",{response})

    if(response.status===200 && response.data){
      setUserInfo({...response.data});
      toast.success("Profile updated successfully.");
      navigate("/chat");
    }
  }catch(err){
    console.log("while saving changes",err);
  }
}
  }


  const handleNavigate=()=>{
    console.log(userInfo.profileSetup); 
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
      toast.error("PLease setup profile.")
    }
  }

  const handleFileInputClick=()=>{
    fileInputRef.current.click()
  }

const handleImageChange=async(e)=>{
const file=e.target.files[0];
console.log({file});
if(file){
  const formData=new FormData();
  formData.append("profile-image",file);
  const response=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{
    withCredentials:true
  })

  if(response.status===200 && response.data.image){
    setUserInfo({...userInfo,image:response.data.image});
    toast.success("Image updated successfully.")
  }

  const reader=new FileReader();
  reader.onload=()=>{
    console.log("reader",reader.result);
    setImage(reader.result);
  }

  reader.readAsDataURL(file);
}

}
const handleDeleteImage=async()=>{
try{
  const response=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{
    withCredentials:true,
  });
  if(response.status===200){
    setUserInfo({...userInfo,image:null});
    toast.success("image removed successfully.")
    setImage(null);
  }

}catch(err){
  console.log(err);
}
}

  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
<div className="flex flex-col gap-10 w-[80vw] md:w-max" >

  <div onClick={handleNavigate}>
    <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer '/>

  </div>

  <div className="grid grid-cols-2">
    <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
    onMouseEnter={()=>setHovered(true)}
    onMouseLeave={()=>setHovered(false)}
    >

      <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden'>
        {image?
        <AvatarImage src={image} alt='profile' className='object-cover w-full h-full'/>:(
        <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full 
        ${getColor(selectedColor)}`}>
          {firstName?firstName.split("").shift():userInfo.email.split("").shift()}
          </div>)}
      </Avatar>
      {
        hovered&& (
          <div 
          onClick={image?handleDeleteImage:handleFileInputClick}
          className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full '>
            {
              image?(<FaTrash className='text-white text-3xl cursor-pointer'/>):
              (
                <FaPlus className='text-white text-3xl cursor-pointer'/>
              )  }
</div>
        )
      } 

      <input type='file' ref={fileInputRef} className=''  style={{ display: 'none' }} onChange={handleImageChange} name="profile-image" accept='.png, .jpg, .jpeg, .svg, .webp'/>
    </div>

    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 items-center justify-center text-white">
      <div className="w-full">
        <Input placeholder="Email" type="email" disabled value={userInfo.email}
        className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
      </div>

      <div className="w-full">
        <Input placeholder="First Name" type="text"
          value={userInfo.firstName}
          onChange={e=>setFirstName(e.target.value)}
        className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
      </div>

      <div className="w-full">
        <Input placeholder="Lat Name" type="text"
          value={userInfo.lastName}
          onChange={e=>setLastName(e.target.value)}
        className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
      </div>
     

<div className="w-full flex gap-5 ">
  {
    colors.map((color,index)=>(

      <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
        selectedColor===index?"outline outline-white/50 outline-2":
        ""
      }`} key={index}  
      onClick={()=>setSelectCoolor(index)}>
         
         </div>
    )
    )
  }
</div>
    </div>
  </div>

  <div className="w-full">
    <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" 
    onClick={saveChanges}>
      Save Changes
    </Button>
  </div>
</div>

    </div>
  )
}

export default Profile