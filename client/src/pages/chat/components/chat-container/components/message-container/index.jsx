import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdFolderZip} from "react-icons/md";
import {IoMdArrowRoundDown} from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";


const MessageContainer = () => {
const {selectedChatType,
  selectedChatData,
  setSelectedChatMessages, 
  userInfo,
  selectedChatMessages,
  setFileDownloadProgress,
  setIsDownloading
}=useAppStore();

const [showImage,setShowImage]=useState(false);
const [imageURL,setImageURL]=useState(null);
const scrollRef=useRef();


useEffect(()=>{

if(selectedChatData._id){

  const getMessages=async()=>{
   try{
const response=await apiClient.post(GET_ALL_MESSAGES_ROUTE,{
  id:selectedChatData._id
},{withCredentials:true});

console.log("message response",response);
if(response.data.messages){
  setSelectedChatMessages(response.data.messages);
}

   }catch(err){
    console.log(err);
   } 
  }

  if(selectedChatType==="contact") getMessages();

}

},[selectedChatData,selectedChatType,setSelectedChatMessages])

useEffect(()=>{

if(scrollRef.current){
  scrollRef.current.scrollIntoView({behavior:"smooth"});
}

},[selectedChatMessages])


useEffect(()=>{
console.log("messages selectedChatData",selectedChatData)
console.log("messages selectedChatType",selectedChatType)
console.log("messages selectedChatMessage",selectedChatMessages)
},[])


const checkIfImage=(filePath)=>{
  const imageRegex=
  /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

  return imageRegex.test(filePath);
}

  const renderMessages=()=>{

    let lastDate=null;
     return selectedChatMessages && selectedChatMessages.map((message,index)=>{
      const  messageDate=moment(message.timestamp).format("YYYY-MM-DD");
      const showDate=messageDate!==lastDate;
      lastDate=messageDate;
      
      return (
        <div key={index}>
          {
            showDate && (

            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
     )}

     {
      selectedChatType=="contact" && renderDMMessages(message)
     }
        </div>
      )
     })

  }

const downloadFile=async(file)=>{
  setIsDownloading(true);
  setFileDownloadProgress(0);

  const response=await apiClient.get(`${HOST}/${file}`,
    {responseType:"blob",
      onDownloadProgress:(progressEvent)=>{
        const {loaded,total}=progressEvent;
        const percentageCompleted=Math.round((loaded*100)/total);
        console.log("percentage downloaded",percentageCompleted)
        setFileDownloadProgress(percentageCompleted);


      }
    });
    const urlBlob=window.URL.createObjectURL(new Blob([response.data]));
    const link=document.createElement("a");
    link.href=urlBlob;
    link.setAttribute("download",file.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
}


  const renderDMMessages=(message)=>(
    <div className={`${
      message.sender!==selectedChatData._id?"text-left":"text-right"
    }`}>
  
  {message.messageType==="text" &&(

    <div className={`${message.sender!==selectedChatData._id ?
      "bg-[#8417ff1]/5 text-[#8417ff]/90 border-[#8417ff]/50":
      "bg-[#2a2b33]/5 text-white/80 border-white/20"
      
      }  border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
{message.content}
  </div>
  )}

  {
    message.messageType==="file" && 
    <div className={`${message.sender!==selectedChatData._id ?
      "bg-[#8417ff1]/5 text-[#8417ff]/90 border-[#8417ff]/50":
      "bg-[#2a2b33]/5 text-white/80 border-white/20"
      
      }  border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
{
checkIfImage(message.fileUrl) ? 
<div className="cursor-pointer"
onClick={()=>{
  setShowImage(true);
  setImageURL(message.fileUrl);
}}
>
<img src={`${HOST}/${message.fileUrl}`}
 height={300} width={300}/>
</div>:
<div className="flex items-center justify-center gap-4">
<span className="text-white/8 text-3xl cursor-pointer bg-black/20 rounded-full p-3">
<MdFolderZip/>
</span>
<span>{message.fileUrl.split("/").pop()}</span>
<span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
onClick={()=> downloadFile(message.fileUrl)}
>
  <IoMdArrowRoundDown />
</span>
</div>
}
  </div>
  }
  <div className="text-xs text-gray-600 ">
{
  moment(message.timestamp).format("LT")
}
  </div>
    </div>
     
);


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef}/>
      {
        showImage && <div className=" fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center
        justify-center backdrop-blur-lg flex-col ">
        
        <div>
          <img src={`${HOST}/${imageURL}`}   className="h-[80vh] w-full bg-cover"/>
          </div>
          <div className="flex gap-5 fixed top-0 mt-5 ">
            <button
            onClick={()=>downloadFile(imageURL)}
            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300">
             <IoMdArrowRoundDown/>
            </button>

            <button
            onClick={()=>{setShowImage(false)
              setImageURL(null);}
            }
            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300">
             <IoCloseSharp/>
            </button>
          </div>
          </div>
      }
      </div>
  )
}

export default MessageContainer