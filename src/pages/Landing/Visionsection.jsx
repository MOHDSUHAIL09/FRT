// Visionsection.jsx
import React from 'react';
import { motion } from 'framer-motion';

// ✅ Images Import
import visionIcon from '../../assets/img/icon/footer_shape01.png';
import missionIcon from '../../assets/img/icon/footer_shape02.png';

const Visionsection = () => {
  return (
    <section id="vision-mission" className="foresight-vision-section">
      <div className="foresight-vision-container">
        <div className="foresight-vision-row">
          <div className="foresight-vision-col-center">
            <div className="foresight-vision-title-wrapper">
              <span className="foresight-vision-subtitle">Foresight Ecosystem</span>
              <h2 className="foresight-vision-title">
                Vision & Mission of a <span>Decentralized Future</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="foresight-vision-grid">
          {/* Vision Card */}
          <div className="foresight-vision-col-6">
            <motion.div 
              className="foresight-vision-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="foresight-vision-icon">
                <img src={visionIcon} alt="Vision" />
              </div>
              <div className="foresight-vision-content">
                <h3 className="foresight-vision-heading">Our Vision</h3>
                <p className="foresight-vision-description">
                  To build a fully decentralized governance ecosystem
                  where every user has equal power in decision-making,
                  ensuring transparency, trust, and community-driven
                  growth through blockchain technology.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Mission Card */}
          <div className="foresight-vision-col-6">
            <motion.div 
              className="foresight-vision-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="foresight-vision-icon">
                <img src={missionIcon} alt="Mission" />
              </div>
              <div className="foresight-vision-content">
                <h3 className="foresight-vision-heading">Our Mission</h3>
                <p className="foresight-vision-description">
                  To simplify Web3 governance and make blockchain
                  participation accessible for everyone through staking,
                  voting, proposals, and transparent ecosystem tools.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Visionsection;