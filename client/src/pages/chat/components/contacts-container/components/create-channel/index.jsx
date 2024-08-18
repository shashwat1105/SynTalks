import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/muitipleselect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { animationsDefaultOptions, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { GET_ALL_CONTACTS_ROUTE, HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa"
import Lottie from "react-lottie";

const CreateChannel = () => {

    const {setSelectedChatData,setSelectedChatType}=useAppStore();
    const [newChannelModal,setNewChannelModal]=useState(false);
    const [searchedContacts,setSearchedContacts]=useState([]);
    const [allContacts,setAllContacts]=useState([]);
    const [selectedContacts,setSelectedContacts]=useState([]);
    const [channelName,setChannelName]=useState("")


    useEffect(()=>{
     const getData=async()=>{
        const response=await apiClient.get(GET_ALL_CONTACTS_ROUTE,{
        withCredentials:true,
        })

        setAllContacts(response.data.contacts);
     }
     getData();

    },[])

 const createChannel=async()=>{

 }

  return (
    <>
    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <FaPlus className="text-neutral-400 text-opacity-90 text-start hover:text-neutral-100 
        cursor-pointer transition-all duration-300  "
        onClick={()=>setNewChannelModal(true)}/>
    </TooltipTrigger>
    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
    Create new Channel
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<Dialog open={newChannelModal} 
onOpenChange={setNewChannelModal}>
<DialogTrigger>Open</DialogTrigger>
  <DialogContent 
  className="bg-[#181920] border-none  gap-10 text-white w-[400px] h-[400px] flex flex-col">
 <DialogHeader>
      <DialogTitle className="text-center"> Please fill up the detail for new channel.</DialogTitle>
      <DialogDescription className="text-center text-[18px]">
    
      </DialogDescription>
    </DialogHeader>
    <div>
        <Input placeholder="Channel Name"
        value={channelName}
        onChange={e=>setChannelName(e.target.value)}
        className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
    </div>
<div className="">
    <MultipleSelector className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
    defaultOptions={allContacts}
    value={selectedContacts}
    onChange={setSearchedContacts}
    emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 ">
            No result found
        </p>
        }
    />
</div>

<div>
<Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
onClick={createChannel}
>Create Channel</Button>
</div>    
 
  </DialogContent>
</Dialog>


    
    </>
  )
}

export default CreateChannel