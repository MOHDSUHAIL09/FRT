import React from 'react';
import { motion } from 'framer-motion';

// ✅ Images Import
import heroBg from '../../assets/img/banner/hero.jpg';
import heroImg01 from '../../assets/img/banner/hero_img01.png';
import heroImg02 from '../../assets/img/banner/hero_img02.png';
import heroImg03 from '../../assets/img/banner/hero_img03.png';
import heroBgShape from '../../assets/img/banner/hero_bg_shape.svg';

const HeroSection = () => {
  return (
    <section 
      className="banner__area banner__bg d-flex align-items-center justify-content-center" 
      style={{ 
boxShadow: 'rgb(50, 56, 109) 7px 12px 20px',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="  ">
            <div className="banner__content text-center">
              <motion.span 
                className="sub-title d-inline-block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                Foresight Future Freedom
              </motion.span>
              
              <motion.h2 
                className="title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                Foresight Decentralized
                <br />
                <span>Governance &</span> Crypto Ecosystem
              </motion.h2>
              
              <motion.p 
                className="mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                style={{ maxWidth: '700px',color: "#fff",}}
              >
                Foresight is a blockchain-based decentralized ecosystem designed to empower communities,
                investors, creators, startups, and organizations through transparent governance,
                token-based participation, and smart contract-driven decision-making.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shapes */}
      <div className="banner__shape position-absolute inset-0" style={{ pointerEvents: 'none', zIndex: 1 }}>
        <img 
          src={heroImg01} 
          alt="shape" 
          className="alltuchtopdown position-absolute" 
          style={{ left: '11%', bottom: '42px', zIndex: -1 }}
        />
        <img 
          src={heroImg02} 
          alt="shape" 
          className="rotateme position-absolute" 
          style={{ zIndex: -1 }}
        />
        <img 
          src={heroImg03} 
          alt="shape" 
          className="alltuchtopdown position-absolute" 
          style={{ right: '10%', bottom: '45px', zIndex: -1 }}
        />
        <img 
          src={heroBgShape} 
          alt="shape" 
          className="banner__bg-shape position-absolute" 
          style={{ top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: -2 }}
        />
      </div>
    </section>
  );
};

export default HeroSection;