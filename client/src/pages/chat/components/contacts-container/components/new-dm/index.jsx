import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { animationsDefaultOptions, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants";
import { useState } from "react";
import { FaPlus } from "react-icons/fa"
import Lottie from "react-lottie";

const NewDm = () => {

    const [openNewContactModal,setOpenNewContactModel]=useState(false);
    const [searchedContacts,setSearchedContacts]=useState([]);

const {setSelectedChatData,setSelectedChatType}=useAppStore();
const searchContacts=async(searchTerm)=>{
     
try{
if(searchTerm.length>0){
    const response=await apiClient.post(SEARCH_CONTACT_ROUTES,{
        searchTerm},{withCredentials:true} );
console.log("search response", response);
    if(response.status===200 && response.data.contacts){
        setSearchedContacts(response.data.contacts);
        console.log("Response after fetching",response.data.contacts);
        console.log("contacts after fetching",searchedContacts);
    }else{
        setSearchedContacts([]); 
    }

}else{
    setSearchedContacts([]); 
}

}catch(err){
console.log("SSearching error catch:",err);
}
    }


const selectNewContact=(contact)=>{

setOpenNewContactModel(false);
setSelectedChatData(contact);
setSelectedChatType("contact")
setSearchedContacts([]);

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
    Select new Contact
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<Dialog open={openNewContactModal} 
onOpenChange={setOpenNewContactModel}>
<DialogTrigger></DialogTrigger>
  <DialogContent 
  className="bg-[#181920] border-none  gap-10 text-white w-[400px] h-[400px] flex flex-col">
 <DialogHeader>
      <DialogTitle className="text-center"> Please select a contact </DialogTitle>
      <DialogDescription className="text-center text-[18px]">
    
      </DialogDescription>
    </DialogHeader>
    <div>
        <Input placeholder="Search Contacts...."
        onChange={e=>searchContacts(e.target.value)}
        className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
    </div>

{
    searchedContacts.length>0 &&(

        
        <ScrollArea className="h-[150px]">
        <div className="flex flex-col gap-5">
            {
                Array.isArray(searchedContacts)&&  searchedContacts.map((contact)=>(
                    <div className="flex gap-3 items-center cursor-pointer" 
                    key={contact._id}  onClick={()=>selectNewContact(contact)}>

<div className='w-12 h-12 relative'>
<Avatar className='h-12 w-12  rounded-full overflow-hidden'>
        {contact.image?
        <AvatarImage
        src={`${HOST}/${contact.image}`} alt='profile' 
         className='object-cover w-full h-full bg-black rounded-full'/>:(
        <div
         className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full 
        ${getColor(contact.color)}`}>
          {contact.firstName?
          contact.firstName.split("").shift():
          contact.email.split("").shift()}
          </div>)}
      </Avatar>
</div>
<div className="flex flex-col">
    <span>
    { contact.firstName && contact.lastName ?
    `${contact.firstName} ${contact.lastName}`:
    contact.email }
    </span>
    <span className="text-xs">{contact.emai} </span>
    
    </div>
 </div>  )) }
        </div>
    </ScrollArea>
    )}
    
    
    
    {
        searchedContacts.length<=0 && (
            <div className="flex-1  md:flex  duration-1000 transition-all flex-col justify-center items-center mt-5 md:mt-0 ">
        
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