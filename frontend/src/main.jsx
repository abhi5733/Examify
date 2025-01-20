import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { Provider } from "@/components/ui/provider"
import App from './App.jsx'
import { ChakraProvider } from "@chakra-ui/react"
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux"
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <Provider store={store}> 
  <ChakraProvider> 
    <App />
    </ChakraProvider>
    </Provider>
    </BrowserRouter>
)
