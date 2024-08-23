import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";


const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef=useRef();
  const { selectedChatType,
     selectedChatData, 
     userInfo, 
     setFileUploadProgress,
    setIsUploading} =useAppStore();
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  //just for debugging
 
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {

      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });

    }else if(selectedChatType==="channel"){
      
socket.emit("send-channel-message",{
  sender: userInfo.id,
  content: message,
  messageType: "text",
  fileUrl: undefined,
  channelId:selectedChatData._id,
})
    }

    setMessage(""); 
  };


  const handleAttachmentClick=()=>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange=async(e)=>{

    try{
const file=e.target.files[0];
console.log({file});

if(file){
  const formData=new FormData();
  formData.append("file",file);
  setIsUploading(true);
  const response=await apiClient.post(UPLOAD_FILE_ROUTE,formData,{
    withCredentials:true,
    onUploadProgress:(data)=>{
      const progress=(Math.round((100*data.loaded)/data.total))
      setFileUploadProgress(progress)
    }
  });

  if(response.status===200 && response.data){
    setIsUploading(false);
    if(selectedChatType==="contact"){

      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: undefined,
        recipient: selectedChatData._id,
        messageType: "file",
        fileUrl: response.data.filePath,
      });
    }
    else if(selectedChatType==="channel"){
      socket.emit("send-channel-message",{
        sender: userInfo.id,
        content: undefined,
        messageType: "file",
        fileUrl: response.data.filePath,
        channelId:selectedChatData._id
      })
    }
  }
}
    }catch(err){
      setIsUploading(false);
      console.log(err);
    }
  }

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-8 gap-6">
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
        />

        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>
<input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange}/>


        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          <div className="absolute bottom-16 right-0 " ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md flex justify-center items-center
       p-5 hover:bg-[#741bda] focus:bg-[#8417ff] focus:border-none focus:outline-none
        focus:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
