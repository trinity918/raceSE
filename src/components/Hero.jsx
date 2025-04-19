import { useState, useEffect } from 'react';
import heroImg1 from '../assets/hero1.webp';
import heroImg2 from '../assets/hero2.webp';
import heroImg3 from '../assets/hero3.webp';
import heroImg4 from '../assets/hero4.webp';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [heroImg1, heroImg2, heroImg3, heroImg4];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content flex-col lg:flex-row-reverse'>
        <div className='w-full max-w-sm'>
          <img 
            src={images[currentImageIndex]} 
            className='w-full h-80 object-cover rounded-lg shadow-2xl' 
            alt='AI assistant'
          />
        </div>
        <div>
          <h1 className='text-5xl font-bold text-primary'>GPTGenius</h1>
          <p className='py-6 max-w-md text-lg leading-loose'>
            GPTGenius: Your AI language companion. Powered by OpenAI, it
            enhances your conversations, content creation, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;