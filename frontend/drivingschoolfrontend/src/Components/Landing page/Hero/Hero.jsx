import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero container'>
      <div className="hero-text">
      <h1> Welcome To Tharuka Driving School</h1>
      <p>Learn to drive with confidence! We provide expert training, flexible scheduling, and a supportive learning environment to help you master the road safely and efficiently. Start your journey with us today</p>

      <Link to="/login"><button className='btn btn1'>Apply Now</button></Link>

      

      </div>
    </div>
  )
}

export default Hero