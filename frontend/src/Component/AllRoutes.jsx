import React from 'react'
import { Routes, Route, Router } from 'react-router-dom'
import UploadContent from './UploadContent'
import MyInfo from '../pages/MyInfo'


const AllRoutes = () => {

   return (
      <Routes>

         <Route path='/' element={<UploadContent />} />
         <Route path='/info' element={<MyInfo/>} />
      </Routes>

   )

}

export default AllRoutes