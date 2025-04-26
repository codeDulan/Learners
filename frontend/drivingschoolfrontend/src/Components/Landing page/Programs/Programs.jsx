import React, { useState, useEffect } from 'react';
import './Programs.css';
import trainingService from '../../../services/trainingService';
import fallbackImage from '../../../assets/program1.jpg'; // Fallback image if no program image is available

// Image mapping for different license types
import motorcycleImage from '../../../assets/program1.jpg'; // Use your motorcycle program image
import lightVehicleImage from '../../../assets/program2.jpg'; // Use your car program image
import heavyVehicleImage from '../../../assets/program3.jpg'; // Use your heavy vehicle program image

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        // Using the public endpoint that doesn't require authentication
        const data = await trainingService.getAllPrograms();
        setPrograms(data);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Get the appropriate image based on license type
  const getProgramImage = (licenseType) => {
    switch(licenseType) {
      case 'MOTORCYCLE':
        return motorcycleImage;
      case 'LIGHT_VEHICLE':
        return lightVehicleImage;
      case 'HEAVY_VEHICLE':
        return heavyVehicleImage;
      default:
        return fallbackImage;
    }
  };

  // If still loading, show a simple loading message
  if (loading) {
    return <div className="programs-loading">Loading programs...</div>;
  }

  // If there was an error, show error message
  if (error) {
    return <div className="programs-error">{error}</div>;
  }

  // If no programs found, show a message
  if (programs.length === 0) {
    return <div className="programs-empty">No training programs available at the moment.</div>;
  }

  // Limit to display only 3 programs on the landing page
  const displayPrograms = programs.slice(0, 3);

  return (
    <div className='programs'>
      {displayPrograms.map((program) => (
        <div className="program" key={program.id}>
          <img 
            src={getProgramImage(program.licenseType)} 
            alt={program.name}
            className={program.licenseType === 'LIGHT_VEHICLE' ? 'prg2' : ''}
          />
          <div className="caption">
            <h2>{program.name}</h2>
            <p>{program.description}</p>
            <div className="program-price">Rs. {program.price.toLocaleString()}</div>
            <div className="program-duration">{program.duration}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Programs;