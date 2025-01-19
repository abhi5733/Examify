import { Box, Image } from '@chakra-ui/react'
import React from 'react'
import logo from "../assets/Examify.png"


const Navbar = () => {
  return (
 <Box h={"10vh"} bgColor={"gray.100"} p={"5px"}  >
<Image  h={"100%"} src={logo} alt='Logo' />
 </Box>
  )
}

export default Navbar