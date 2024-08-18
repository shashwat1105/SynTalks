export const createChatSlice=(set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],
    directMessagesContacts:[],
    isUploading:false,
    isDownloading:false,
    fileUploadprogress:0,
    fileDownloadProgress:0,

    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setSelectedChatData:(selectedChatData)=>set({selectedChatData}),
    setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),
    setDirectMessagesContacts:(directMessagesContacts)=>set({directMessagesContacts}),
    setIsUploading:(isUploading)=>set({isUploading}),
    setIsDownloading:(isDownloading)=>set({isDownloading}),
    setFileUploadProgress:(fileUploadprogress)=>set({fileUploadprogress}),
    setFileDownloadProgress:(fileDownloadProgress)=>set({fileDownloadProgress}),

    closeChat:()=>set({
        selectedChatData:undefined,
        selectedChatType:undefined,
        selectedChatMessages:[]
    }),
    addMessage:(message)=>{
        const selectedChatMessages=get().selectedChatMessages;
        const selectedChatType=get().selectedChatType;


        set({
            selectedChatMessages:[
                ...selectedChatMessages,
                {
                    ...message,
                    recipient:
                    selectedChatType==="channel"?
                    message.recipient: message.recipient._id,

                    sender:
                    selectedChatType==="channel"?
                    message.sender: message.sender._id,
                }
            ]
        })
    }
})