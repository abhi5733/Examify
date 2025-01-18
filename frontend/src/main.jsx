import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Provider } from "@/components/ui/provider"
import App from './App.jsx'
import { ChakraProvider } from "@chakra-ui/react"

createRoot(document.getElementById('root')).render(
  <ChakraProvider> 
    <App />
    </ChakraProvider>
)
