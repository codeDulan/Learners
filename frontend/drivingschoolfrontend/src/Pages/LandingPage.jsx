import React from 'react'
import Navbar from '../Components/Landing page/Navbar/Navbar'
import Hero from '../Components/Landing page/Hero/Hero'
import Tittle from '../Components/Landing page/Tittle/Tittle'
import Program from '../Components/Landing page/Programs/Programs'
import Contact from '../Components/Landing page/Contact/Contact' 
import Footer from '../Components/Landing page/Footer/Footer'
import About from '../Components/Landing page/About/About'

const LandingPage = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <div className="container"> 
      <Tittle subTittle='Our Main Packages' tittle='What We Offer'/>
      <Program/> 
      <About/>
      <Tittle subTittle='Contact Us' tittle='Get in Touch'/>
      <Contact/>
      <Footer/>
      
      </div>
      

    </div>
  )
}

export default LandingPage