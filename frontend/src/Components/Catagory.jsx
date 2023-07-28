import React from 'react'
import { Link } from 'react-router-dom'
const Catagory = ({cata}) => {
  return (
    <div>
          <div className={`catagory flex flex-col  gap-7 rounded-xl py-8 px-8 text-center justify-center items-center ${"bg-deep-orange-600"} `} >
            {cata.icons}
            <Link to={`/products/?cara=${cata.text.trim(" ")}`} className= 'cursor-pointer   w-32 rounded-lg bg-white   tracking-wide font-bold py-3 my-2 '>
{cata.text.toUpperCase()}
            </Link>
          </div>

          </div>
  )
}

export default Catagory