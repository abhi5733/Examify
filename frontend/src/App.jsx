import { useState } from 'react'
import { Box, Heading } from "@chakra-ui/react"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UploadContent from './Component/UploadContent'
// import './App.css'

function App() {


  return (
    <>
    <Box>
      

<Heading> Welcome to Examify , MCQ generator app</Heading> 
    <UploadContent/>
    </Box>
    </>
  )
}

export default App
