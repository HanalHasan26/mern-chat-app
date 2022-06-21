import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
import { useHistory } from 'react-router-dom'

function HomePage() {

const history =useHistory();

  useEffect(() => {
    const userInfo =JSON.parse(localStorage.getItem("userInfo"))

    if(userInfo)  history.push('/chats')   
}, [history])

  return (
    <Container maxW='xl' centerContent>
      <Box
      d='flex'
      justifyContent='center'
      p={3}
      bg={'white'}
      width="100%"
      m="40px 0 15px 0"
      borderRadius="10px"
      borderWidth="1px"
      >
        <Text
        fontSize='4xl'
        fontFamily="Work sans"
        color='black'
        textAlign={"center"}
        >Talk-A-Tive</Text>
      </Box>
      <Box bg={'white'} w='100%' p={'4'} borderRadius='10px' color={'black'} borderWidth={'1px'}>
      <Tabs variant='soft-rounded'>
  <TabList>
    <Tab width={'50%'}>Login</Tab>
    <Tab width={'50%'}>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  )
}

export default HomePage 