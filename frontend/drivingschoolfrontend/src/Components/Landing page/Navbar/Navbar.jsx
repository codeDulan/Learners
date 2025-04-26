import React from 'react'
import './Navbar.css'
import logo from '../../../assets/logo.png'
import menu from '../../../assets/menu.png'
import { Link as ScrollLink } from 'react-scroll'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='container'>
    <div className='logo-div'>
    <img src={logo} alt="" className='logo'/>
    <h2 className='logo-text'> Tharuka</h2>
    </div>
    
    <ul>
        <li><ScrollLink to='hero' smooth={true} offset={0} duration={500}>Home</ScrollLink></li>
        <li>Gallery</li>
        <li><ScrollLink to='about' smooth={true} offset={-240} duration={500}>About Us</ScrollLink></li>
        <li><ScrollLink to='contact' smooth={true} offset={-250} duration={500}>Contact Us</ScrollLink></li>
        <Link to="/login"><li><button className='btn btn-apply'>Apply Now</button></li></Link>
        
    </ul>
    <img src={menu} alt="" className='menu-icon' /> 
    

    </nav>
  )
}

export default Navbar