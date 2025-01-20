import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text , Divider} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { LoginFunction } from '../redux/Action'

const LoginSignup = () => {

    const[toggle,setToggle] = useState(false)

    const[state,setState] = useState({})
    const dispatch = useDispatch()

// handle Form Change

    const handleChange = (e)=>{

const {value,name} = e.target
setState(prev=>({...prev,[name]:value}))
   
}

// handle User Submit

    const handleUserSubmit =  async (e)=>{
    e.preventDefault()
    console.log(state)
    if(!toggle){
        console.log(1)
        // handle Sign up function
try{
      const user = await  axios.post("http://localhost:7300/user/register",state)
   console.log(user,"user")
   setState({})
}catch(err){
    console.log(err)
}

    }else{
        //  handle login function

        try{
            const user = await  axios.post("http://localhost:7300/user/login",state)
         console.log(user,"user")
         dispatch(LoginFunction())
         setState({})
         
      }catch(err){
          console.log(err)
      }
    }
}


  return (
 <Box w={[ "90%","70%","50%","50%"]}  bgColor={"whiteAlpha.800"} m={"auto"}>
{/* Login Box */}
    {toggle?<Box w={"80%"} m={"auto"}  p={"10px"} >
       

        <form onSubmit={handleUserSubmit}>
    <FormControl isRequired>
    <Heading fontSize={"xl"}>Login Form</Heading>

    <FormLabel mt={5}>Email</FormLabel>
    <Input border={"1px solid black"} type="email" name="email" onChange={handleChange} value={state.email} />
    
    <FormLabel mt={5}>Password</FormLabel>
    <Input border={"1px solid black"} type="Password" name="password" onChange={handleChange} value={state.password} />
    
    <Button
      color={"white"}
      _hover={{ bgColor: "pink" }}
      bgColor={"pink.400"}
      type="submit"
      mt={5}
    >
     Login
    </Button>
  </FormControl>
</form>
<Divider my={4} borderColor="black"/>
<Button mt={"10px"}  color={"white"}
      _hover={{ bgColor: "pink" }}
      bgColor={"pink.400"} onClick={()=>setToggle((prev)=>!prev)} >SignUp First</Button>

    </Box>:
    // Signup Box
    <Box w={"80%"} m={"auto"}  p={"10px"}>
 
        <form onSubmit={handleUserSubmit}>
  <FormControl isRequired>
    <Heading fontSize={"xl"}>Signup form</Heading>

    <FormLabel mt={5}>Name</FormLabel>
    <Input border={"1px solid black"} type="text" name="name" onChange={handleChange} value={state.name} />
    
    <FormLabel mt={5}>Email Address</FormLabel>
    <Input border={"1px solid black"} type="email" name="email" onChange={handleChange} value={state.email} />
   
    <FormLabel mt={5}>Password</FormLabel>
    <Input border={"1px solid black"} type="password" name="password" onChange={handleChange} value={state.password} />
  
    <Button
     color={"white"}
     _hover={{ bgColor: "pink" }}
     bgColor={"pink.400"}
      type="submit"
      mt={5}
    >
     Signup
    </Button>
  </FormControl>
</form>
<Divider my={4} borderColor="black"/>
        <Button  color={"white"}
      _hover={{ bgColor: "pink" }}
      bgColor={"pink.400"} mt={"10px"}  onClick={()=>setToggle((prev)=>!prev)} >Login</Button>
        </Box>}



 </Box>
  )
}

export default LoginSignup