import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Provider } from "@/components/ui/provider"
import App from './App.jsx'
import { ChakraProvider } from "@chakra-ui/react"
import {BrowserRouter} from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <ChakraProvider> 
    <App />
    </ChakraProvider>
    </BrowserRouter>
)
