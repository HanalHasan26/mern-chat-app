import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
import Mychats from '../Components/Authentication/miscellaneous/Mychats'
import SideDrawer from '../Components/Authentication/miscellaneous/SideDrawer'
import ChatBox from '../Components/Authentication/miscellaneous/ChatBox'

function ChatPage() {
const [fetchAgain, setFetchAgain] = useState()
const { user } = ChatState();

  return (

    <div style={{ width : "100%" }}>      
        { user && <SideDrawer/>}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
          {user && <Mychats fetchAgain={fetchAgain} />}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
        </Box>
    </div>

  );
};

export default ChatPage 