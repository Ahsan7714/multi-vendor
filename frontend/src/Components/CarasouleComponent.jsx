import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
const CarasouleComponent = ({cara}) => {
  return (
    <div>

    <div className="relative  w-full" style={{height:"89vh"}}>
    <img
      src={cara.image}
      alt="image 1"
      className="h-full w-full object-cover"
    />

  </div>
    </div>
  )
}   

export default CarasouleComponent