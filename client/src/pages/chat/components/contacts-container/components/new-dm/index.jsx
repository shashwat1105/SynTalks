import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { animationsDefaultOptions } from "@/lib/utils";
import { SEARCH_CONTACT_ROUTES } from "@/utils/constants";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { useState } from "react";
import { FaPlus } from "react-icons/fa"
import Lottie from "react-lottie";

const NewDm = () => {

    const [openNewContactModal,setOpenNewContactModel]=useState(false);
    const [searchedContacts,setSearchedContacts]=useState([]);


    const searchContacts=async(searchTerm)=>{
     
try{
if(searchTerm.length>0){
    const response=await apiClient.post(SEARCH_CONTACT_ROUTES,{
        searchTerm},{withCredentials:true}
    )
    if(response.status===200 && response.data.contacts){
        setSearchedContacts(response.data.contacts);
    }
}else{
    setSearchedContacts([]); 
}

}catch(err){
console.log("SSearching error catch:",err);
}
    }


  return (
    <>
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <FaPlus className="text-neutral-400 text-opacity-90 text-start hover:text-neutral-100 
        cursor-pointer transition-all duration-300  "
        onClick={()=>setOpenNewContactModel(true)}/>
    </TooltipTrigger>
    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModel}>

  <DialogTrigger>Open</DialogTrigger>
  <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">

    <DialogHeader>
      <DialogTitle>Please select a contact </DialogTitle>
      <DialogDescription>
       
      </DialogDescription>
    </DialogHeader>
    <div>
        <Input placeholder="Search Contacts"
        onChange={e=>searchContacts(e.target.value)}
        className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
    </div>
    {
        searchContacts.length<=0 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex mt-5 duration-1000 transition-all flex-col justify-center items-center hidden">
        
            <Lottie isClickToPauseDisabled={true} 
            height={100} width={100} 
            options={animationsDefaultOptions}/>
            
            <div className="text-opacity-80   text-white gap-5 items-center mt-5 lg:text-2xl text-3xl transition-all duration-300 text-center ">
                <h3 className="poppins-medium">
                    Hi <span className="text-purple-500">! </span>Search new
                    <span className="text-purple-500"> Contact. </span>
                </h3>
            </div>
            </div>
        )
    }
  </DialogContent>
</Dialog>


    
    </>
  )
}

export default NewDm