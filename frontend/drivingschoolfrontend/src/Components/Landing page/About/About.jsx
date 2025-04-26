import React from 'react'
import './About.css'
import about_img from '../../../assets/aboutus.jpg'

const About = () => {
  return (
    <div className='about'>
     <div className="about-right">
       <img src={about_img} alt=""  className='about-img'/>
    </div>

    <div className="about-left">
      <h2>Who we are?</h2>
      <p>Tharuka driving school started in 1960 by Mr.Karunadasa Hewawaduge. Soon after it become a very trusted Government Registered Driving school in the Kurunegala area as well as the country. All our Professional & qualified instructors are always with us in the journey. As a Leading Driving School in Kurunegala we give you a better train to pass your driving test as well as we make you a diciplined & responsible Driver.  </p>
    
      
      
      
      <h2>Why we are special?</h2>
      <p>Getting your driving license is a millstone in your life. Since the movement you sit on the driver position our concentrate on you to train & improve your driving skills. We have great squad of instructors who will teach you easy tips to get though your driving practical test on the first attempt. You may be a just after 18 or a busy person with your work. That's why we offer flexible training hours to you to get your license easily. All vehicles are comfortable & well maintained. All the trains will do on a public streets & roads to make your a road ready driver.  </p>
    </div>

    </div>
  )
}

export default About