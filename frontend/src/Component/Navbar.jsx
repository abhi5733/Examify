import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import logo from "../assets/Examify.png"
import { useSelector } from 'react-redux'
import { GiHamburgerMenu } from "react-icons/gi";
import { motion } from "framer-motion";
import { ImCancelCircle } from "react-icons/im";
import { Link } from 'react-router-dom';

const Navbar = () => {
const[menu,setMenu] = useState(false)
  const token = useSelector(store=>store.token) ;
  

  return (
    <Box h={"10vh"} bgColor={"gray.100"} p={"5px"}  >
     <Flex h={"100%"} justifyContent={"space-between"} alignItems={"center"} > <Link to="/">  <Image h={"100px"} w={"200px"} src={logo} alt='Logo' />  </Link>
      {token && <GiHamburgerMenu onClick={()=>{setMenu((prev)=>!prev)}} style={{fontSize:"30px",marginRight:"10px"}} />} </Flex> 
 
  {menu && (
        <motion.div
        onClick={()=>setMenu(false)}
        initial={{ x: menu ? "100%" : "0%" }} // Start off-screen if the menu is closed
        animate={{ x: menu ? 0 : "100%" }} // Animate to 0 if open, or off-screen when closed
        transition={{ type: "tween", duration: 0.5 }} // Smooth transition
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "500px", // Full height
        
          zIndex: 1000, // Ensure it's above other elements
          backgroundColor: "white",
        boxShadow:"xl"
        }}
      >
        <Box   width={["100vw","80vw","500px","500px"]} p={5}>
       
        <Flex justifyContent={"flex-end"}> <ImCancelCircle style={{fontSize:"30px"}} onClick={()=>setMenu(prev=>!prev)} />  </Flex>
       <Link to="/info">  <Text fontSize={"20px"} >My Profile</Text> </Link>
        </Box>
      </motion.div>
      )}
    </Box>
  )
}

export default Navbar