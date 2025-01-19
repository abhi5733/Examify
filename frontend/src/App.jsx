import { useState } from 'react'
import { Box, Heading } from "@chakra-ui/react"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UploadContent from './Component/UploadContent'
import AllRoutes from './Component/AllRoutes'
import Navbar from './Component/Navbar'
// import './App.css'

function App() {


  return (
    <>
    <Box>
      
<Navbar/>
<AllRoutes/>
    {/* <UploadContent/> */}
    </Box>
    </>
  )
}

export default App
