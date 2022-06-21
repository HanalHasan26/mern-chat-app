import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function Signup() {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassoword, setConfirmpassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

   const HandleClick = () =>{
        setShow(!show)
    }

   const postDetails = (pics) =>{
      setLoading(true)
      if(pics===undefined){
        toast({
            title: 'Please Select an Image',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          return;
      }

      if(pics.type==="image/jpeg"|| pics.type==="image/png"){
          const data = new FormData();
          data.append("file", pics);
          data.append("upload_preset", "chat-app")
          data.append("cloud_name","dhf2t2ffz")
          fetch("https://api.cloudinary.com/v1_1/dhf2t2ffz/image/upload",{
              method:'post',
              body:data,
          }).then((res)=> res.json())
          .then(data => {
              console.log(data);
              setPic(data.url.toString());
              setLoading(false)
          })
          .catch((err)=>{
              console.log(err);
              setLoading(false)
          });
      }else{
        toast({
            title: 'Please Select an Image',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          setLoading(false)
          return;        
      }
   } 

   const SubmitHandle = async() =>{
        setLoading(true);
    if(!name || !email || !password || !confirmpassoword) {
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
    if( password !== confirmpassoword){
        toast({
            title: 'Passwords do not match',
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
          "/api/user",
          {name,email,password,pic},
          config
          );
          toast({
            title: 'Registeration Successful',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });

          localStorage.setItem('userinfo',JSON.stringify(data))
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

<FormControl id='first-name' isRequired>
    <FormLabel>Name</FormLabel>
    <Input placeholder='Enter Your Name'
    onChange={(e)=>{
        setName(e.target.value)
    }}
    />
</FormControl>
<FormControl id='Email' isRequired>
    <FormLabel>Email</FormLabel>
    <Input placeholder='Enter Your Email'
    onChange={(e)=>{
        setEmail(e.target.value)
    }}
    />
</FormControl>

<FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>  
    <Input
    type={show ? "text":'password'} placeholder='Enter Your Password'
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

<FormControl id='confirmpassword' isRequired>
    <FormLabel>Confirm Password</FormLabel>
    <InputGroup>  
    <Input
    type={show ? "text":'password'} placeholder='Confirm Password'
    onChange={(e)=>{
        setConfirmpassword(e.target.value)
    }}
    />
    <InputRightElement>
    <Button h="1.7rem" size='xs' variant={'unstyled'}  onClick={HandleClick}>
        {show  ? "Hide" : "Show"}
    </Button>
    </InputRightElement>
    </InputGroup>
</FormControl>

<FormControl id='pic' isRequired>
    <FormLabel>Upload your Picture</FormLabel>
    <Input
    type={"file"}
    p={'1.5'}
    accept="image/*"
    onChange={(e)=>{
        postDetails(e.target.files[0])
    }}
    />
</FormControl>

<Button
 colorScheme={'blue'}
 width='100%'
 style={{marginTop:15}}
 onClick={SubmitHandle}
 isLoading={loading}
 >Sign Up</Button>
</VStack>




  )
}

export default Signup