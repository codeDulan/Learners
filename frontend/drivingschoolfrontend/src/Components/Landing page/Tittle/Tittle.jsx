import React from 'react'
import './Tittle.css'

const Tittle = ({subTittle, tittle}) => {
  return (
    <div className='tittle'>
       <p>{subTittle}</p>
       <h1>{tittle}</h1>
    </div>
  )
}

export default Tittle