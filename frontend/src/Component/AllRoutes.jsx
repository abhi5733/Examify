import React from 'react'
import { Routes , Route ,Router } from 'react-router-dom'
import UploadContent from './UploadContent'


const AllRoutes = () => {
 
   return( 
        <Routes> 
         
    <Route  path='/' element={   <UploadContent/>  }  />

    </Routes>
   
   )

}

export default AllRoutes