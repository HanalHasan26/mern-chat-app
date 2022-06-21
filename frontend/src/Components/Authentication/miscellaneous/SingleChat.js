import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../../../config/ChatLogics'
import { ChatState } from '../../../Context/ChatProvider'
import ProfileModal from './ProfileModel'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import '../../styles.css'
import ScrollableChat from '../../ScrollableChat'
import io from "socket.io-client"
import Lottie from 'react-lottie'
import animationData from "../../../Animations/typing.json"

const defaultOptions = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    renderSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

const ENDPOINT = "https://mern-chat-app-byhanal.herokuapp.com/";
var socket, selectedChatCompare;



const SingleChat = ({fetchAgain , setFetchAgain}) => {

    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [istyping, setIsTyping] = useState(false)

    const {user,  selectedChat, setSelectedChat, notification, setNotification ,chats}= ChatState()
    const toast = useToast()

    const fetchMessages = async ()=>{
        if(!selectedChat) return;

        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
              setLoading(true)
              const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)

              setMessage(data)
              setLoading(false)

              socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title:"Error Occured!",
                description:"Failed to Load the messages",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    useEffect(() => {
        socket =io(ENDPOINT);
        socket.emit("setup",user);
        socket.on('connected',()=>{
          setSocketConnected(true)
        })
        socket.on('typing',()=> setIsTyping(true))
        socket.on('stop typing', ()=>setIsTyping(false))
      }, [])
 
    useEffect(() => {
     fetchMessages()

     selectedChatCompare = selectedChat;
    }, [selectedChat])

    console.log(chats[0],user);

    useEffect(() => {
      socket.on("message recived", (newMessageRecived)=>{
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecived.chat._id){

            if(!notification.includes(newMessageRecived)){
                setNotification([newMessageRecived, ...notification])
                setFetchAgain(!fetchAgain) 
            }

        }else{
            setMessage([...message, newMessageRecived])
        }
      });
    })
    
    

    const sendMessage = async(event)=>{

        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
              const config = {
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
              };
              setNewMessage('');
              const { data } = await axios.post(
                "/api/message",
                {
                  content: newMessage,
                  chatId: selectedChat,
                },
                config
              );



              console.log(data);
              socket.emit('new message', data)
              setMessage([...message, data]);
            } catch (error) {
                toast({
                    title: "error",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  }); 
            }
        }
    }


    

    const typingHandler = async (e) =>{
        setNewMessage(e.target.value)

        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 2000;
        setTimeout(()=>{
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing",selectedChat._id)
                setTyping(false);
            }    
        }, timerLength)

     
    }

  return (
    <>
        {selectedChat ? (
            <>
                <Text
                fontSize={{base : "28px", md:"30px"}}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                display={"flex"}
                justifyContent={{ base : "space-between"}}
                alignItems="center"
                >
                    <IconButton 
                    display={{base : "flex",md:"none"}}
                    icon={<ArrowBackIcon/>}
                    onClick={()=> setSelectedChat("")}
                    />
                    {!selectedChat.isGroupeChat?(
                        <>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                        </>
                    ):(
                        <>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages ={fetchMessages}/>
                        </>
                    )}
                </Text>  
                <Box
                display={'flex'}
                flexDir="column"
                justifyContent={"flex-end"}
                p={3}
                bg="#E8E8E8"
                w={"100%"}
                h="100%"
                borderRadius={"10px"}
                overflowY="hidden"
                >
                    {loading ? (
                        <Spinner
                        size={'xl'}
                        w={20}
                        h={20}
                        alignSelf="center"
                        margin={"auto"}
                        />
                    ):
                    <div className='messages'>
                        <ScrollableChat message={message}/>
                    </div>}

                        <FormControl
                        onKeyDown={sendMessage}
                        isRequired
                         mt={3}
                        >
                            {istyping ? <div>
                            <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{marginBottom:15, marginLeft:0}}
                            />
                            </div>:<></>}

                            <Input
                            variant={'filled'}
                            bg="#E0E0E0"
                            placeholder='Enter a message..'
                            value={newMessage} 
                            onChange={typingHandler}
                            />
                        </FormControl>
                </Box>
            </>
        ):(
            <Box
            display="flex"
            alignItems={"center"}
            justifyContent="center"
            h={"100%"}
            >
                <Text
                fontSize={"3xl"}
                pb={3}
                fontFamily="Work sans"
                >
                    Click on a user to start chatting    
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat