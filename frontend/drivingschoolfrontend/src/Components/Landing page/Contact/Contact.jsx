import React from 'react'
import './Contact.css'
import msg_icon from '../../../assets/mail.png'
import location_icon from '../../../assets/location.png'
import call_icon from '../../../assets/call.png'
import blue_arrow from '../../../assets/blue-arrow.png'




const Contact = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "be67857a-68cf-4cc4-ac0d-e7fb407d02cb");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };






  return (
    <div className='contact'>
     <div className="contact-col">
       <h3>Send us a message</h3>
       <p>Feel free to reach out through contac from or find our contact information below. Your feedback, questions and suggestions are  important to us.</p>
       <ul> 
          <li><img src={msg_icon} alt="" />tharukadriving@gmail.com</li>
          <li><img src={call_icon} alt="" />071-4089577</li>
          <li><img src={location_icon} alt="" />No.253 Kurunegala Rd, Wariyapola</li>
    
      </ul>
       
       
       
       </div>
     <div className="contact-col">
        <form onSubmit={onSubmit}>
          <label>Your name</label>
          <input type="text" name='name' placeholder='Enter your name' required/>
          <label>Phone Number</label>
          <input type="tel" name='phone' placeholder='Enter your mobile number' required/>
          <label>Write your message here</label>
          <textarea name="message"  rows="6" placeholder='Enter your message' required></textarea>
          <button type='submit' className='btn dark-btn'>Submit Now <img src={blue_arrow} alt="" ></img></button>


        </form>
        <span>{result}</span>


     </div>
     
     
     </div>

    
  )
}

export default Contact