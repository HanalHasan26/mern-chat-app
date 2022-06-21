import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

function Login() {

    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()
    const HandleClick = () =>{
        setShow(!show)
    }

   const SubmitHandle = async() =>{
    setLoading(true);
    if( !email || !password ) {
        toast({
            title: 'Please Fill all the Filelds',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          setLoading(false)
        return;
    }
    try {
      const config = { 
          headers: {
              "Content-type":"application/json"
          },
      }

      const {data} = await axios.post(
          "/api/user/login",
          {email,password},
          config
          );
          toast({
            title: 'Login Successful',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });

          localStorage.setItem("userInfo",JSON.stringify(data))
          setLoading(false);
          history.push("/chats")
    } catch (error) {
        toast({
            title: 'Error Occured',
            description: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          setLoading(false)  
    }      
   }


  return (
    <VStack spacing='5px' color={"black"}>

<FormControl id='Email' isRequired>
    <FormLabel>Email</FormLabel>
    <Input placeholder='Enter Your Email'
    value={email}
    onChange={(e)=>{
        setEmail(e.target.value)
    }}
    />
</FormControl>

<FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>  
    <Input
    type={show ? "text":'password'} 
    placeholder='Enter Your Password'
    value={password}
    onChange={(e)=>{
        setPassword(e.target.value)
    }}
    />
    <InputRightElement>
    <Button h="1.7rem" size='xs' variant={'unstyled'}  onClick={HandleClick}>
        {show  ? "Hide" : "Show"}
    </Button>
    </InputRightElement>
    </InputGroup>
</FormControl>

<Button
colorScheme={'blue'}
width='100%'
style={{marginTop:15}}
onClick={SubmitHandle}
isLoading={loading}
>Login</Button>

<Button
colorScheme={'red'}
width='100%'
style={{marginTop:15}}
onClick={()=>{
    setEmail("guest@gmail.com")
    setPassword("123456")
}}

>Get Guest User </Button>

</VStack>
  )
}

export default Login