import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { IoPowerSharp } from 'react-icons/io5'
import apiClient from '@/lib/api-client'

const ProfileInfo = () => {

    const {userInfo,setUserInfo}=useAppStore();
    const navigate=useNavigate();


    const logOut=async()=>{

try{
console.log("before profile resp");
  const response=await apiClient.post(LOGOUT_ROUTE,{},{
    withCredentials:true,
  })
console.log("respone",{response})
  if(response.status===200){
    setUserInfo(null);
    navigate("/auth");

  }
}catch(err){
  console.log(err);
}
      
    }
  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
        <div className='flex gap-3 items-center justify-center'>
<div className='w-12 h-12 relative '>
<Avatar className='h-12 w-12   rounded-full overflow-hidden'>
        {userInfo.image?
        <AvatarImage
         src={`${HOST}/${userInfo.image}`} alt='profile' 
         className='object-cover w-full h-full'/>:(
        <div
         className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full 
        ${getColor(userInfo.color)}`}>
          {userInfo.firstName?userInfo.firstName.split("").shift():userInfo.email.split("").shift()}
          </div>)}
      </Avatar>
</div>
<div>
    {userInfo.firstName && userInfo.lastName?`${userInfo.firstName} ${userInfo.lastName}`:""}
</div>
        </div>
        

<div className='flex gap-5'>
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        
        <FiEdit2 
        onClick={()=>navigate("/profile")}
        className='text-purple-500 text-xl font-medium'/>
    </TooltipTrigger>
    <TooltipContent className='bg-[#1c1b1e] p-2 rounded-md text-white border-none'>
      Edit Profile
    </TooltipContent>
  </Tooltip>
</TooltipProvider>


<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        
        <IoPowerSharp
        onClick={()=>{
          console.log("clickedddd");
          logOut()
        console.log("after click")
        }}
        className='text-red-500 cursor-pointer text-xl font-medium'/>
    </TooltipTrigger>
    <TooltipContent className='bg-[#1c1b1e] p-2 rounded-md text-white border-none'>
      Logout
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
</div>
        </div>
  )
}

export default ProfileInfo