import { Tabs, TabsContent, TabsTrigger } from '@radix-ui/react-tabs';
import victory from '../../assets/victory.svg';
import { TabsList } from '@/components/ui/tabs';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Background from '../../assets/login2.png';
import { toast } from 'sonner';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import apiClient from '../../lib/api-client.js'
import { useNavigate } from 'react-router-dom';

const Auth=()=>{


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");
const navigate=useNavigate();


const validateLogin=()=>{
    if(!email.length){
        toast.error("Email is requied.");
        return false;
    }

    if(!password.length){
        toast.error("Password is requied.");
        return false;
    }
    return true;
}

const handleLogin=async()=>{
if(validateLogin()){
    const response=await apiClient.post(
        LOGIN_ROUTE,{email,password},{
        withCredentials:true
    });
    if(response.data.user.id){
        if(response.data.user.profileSetup){
            navigate('/chat');
        }else{
            navigate("/profile");
        }
    }
    console.log({response});
}
}

const validateSignup=()=>{
    if(!email.length){
        toast.error("Email is requied.");
        return false;
    }
    if(!password.length){
        toast.error("Password is requied.");
        return false;
    }
    if(password!==confirmPassword){
        toast.error("Password and confirm passowrd should be same.");
        return false;
    }

    return true;
}
 
const handleSignup=async()=>{

    if(validateSignup()){

const response=await apiClient.post(SIGNUP_ROUTE,{email,password},{
    withCredentials:true
});

if(response.status===201){
    navigate("/profile")
}
console.log({response});
    }

}

    return <div className="h-[100vh] w-[100vw] flex items-center justify-center">
    <div className="h-[80vh] bg-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 border-white">

        <div className="flex flex-col gap-10 items-center justify-center">
<div className="flex items-center justify-center">

    <h1 className="text-5xl font-bold lg:text-6xl">Welcome</h1>
    <img src={victory} alt='photo' className='h-[100px]'/>
</div>
<p className='font-medium text-center'>
    Fill in the details to get started with the best chat app!
</p>

        </div>
        <div className="flex items-center justify-center w-full">
            <Tabs className='w-3/4 ' defaultValue='login'>
                <TabsList className='bg-transparent rounded-none w-full'>
                    <TabsTrigger value='login' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300'>Login</TabsTrigger>
                     
                    <TabsTrigger value='signup' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300'>Signup</TabsTrigger>
                </TabsList>
                <TabsContent className='flex flex-col gap-5 mt-10' value='login'>

                    <Input placeholder='Email' type="email" className="rounded-full p-6" value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                         <Input placeholder='Password' type="password" className="rounded-full p-6" value={password}
                    onChange={(e)=>setPassword(e.target.value)}/>
              
                 <Button className='rounded-full p-6' onClick={handleLogin}>Login</Button>

                </TabsContent>
                <TabsContent className='flex flex-col gap-5' value='signup'>

                <Input placeholder='Email' type="email" className="rounded-full p-6" value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                         <Input placeholder='Password' type="password" className="rounded-full p-6" value={password}
                    onChange={(e)=>setPassword(e.target.value)}/>
                      <Input placeholder='Confirm Password' type="password" className="rounded-full p-6" value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}/>

<Button className='rounded-full p-6' onClick={handleSignup}>Signup</Button>

                </TabsContent>
            </Tabs>
        </div>
    </div>
        
<div className="hidden xl:flex justify-center items-center">
    <img src={Background} alt='background login' className='h-[700px]'/>
</div>

        </div>
};

export default Auth;