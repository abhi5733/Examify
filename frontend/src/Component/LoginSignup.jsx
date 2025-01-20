import { Box, Button, Heading, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

const LoginSignup = () => {

    const[toggle,setToggle] = useState(false)

  return (
 <Box w={"50%"} h={"500px"} bgColor={"whiteAlpha.800"} m={"auto"}>

    {toggle?<Box  >
        <Heading textAlign={"center"}>Login</Heading>
        <Button onClick={()=>setToggle((prev)=>!prev)} >SignUp</Button>
    </Box>:<Box>
        <Heading textAlign={"center"}>Signup</Heading> 
        <Button onClick={()=>setToggle((prev)=>!prev)} >Login</Button>
        </Box>}



 </Box>
  )
}

export default LoginSignup