import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Header from './Components/Header'
import axios from 'axios'
import Home from './pages/Home'
import Products from './pages/Products'
const App = () => {
  axios.defaults.baseURL="http://localhost:3000"

  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route  path='/products' element={<Products/>}/>

      </Routes>
    </Router>
  )
}

export default App