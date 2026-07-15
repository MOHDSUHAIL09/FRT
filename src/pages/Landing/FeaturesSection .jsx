// FeaturesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';

// ✅ Images Import
import featuresIcon01 from '../../assets/img/icon/features_icon01.png';
import featuresIcon02 from '../../assets/img/icon/features_icon02.png';
import featuresIcon03 from '../../assets/img/icon/features_icon03.png';
import featuresIcon04 from '../../assets/img/icon/features_icon04.png';
import featuresIcon05 from '../../assets/img/icon/features_icon05.png';
import featuresShape from '../../assets/img/images/features_shape.png';

const FeaturesSection = () => {
  return (
    <section id="features" className="foresight-features-section">
      <div className="foresight-features-container">
        {/* Section Title */}
        <div className="foresight-features-title-wrapper">
          <div className="foresight-features-title-content">
            <span className="foresight-features-subtitle">Decentralized Participation For Everyone</span>
            <h2 className="foresight-features-title">
              Web3 <span>Governance</span> Made Accessible
            </h2>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="foresight-features-grid">
          {/* Card 1 */}
          <div className="foresight-features-col-6">
            <motion.div 
              className="foresight-features-card foresight-features-card-horizontal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="foresight-features-icon">
                <img src={featuresIcon01} alt="Smart Contract" />
              </div>
              <div className="foresight-features-content">
                <h3 className="foresight-features-heading">Smart Contract <span>Governance</span></h3>
                <p className="foresight-features-description">Transparent blockchain-based governance enabling secure voting, proposals, and community decision-making.</p>
              </div>
            </motion.div>
          </div>

          {/* Card 2 */}
          <div className="foresight-features-col-6">
            <motion.div 
              className="foresight-features-card foresight-features-card-horizontal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="foresight-features-icon">
                <img src={featuresIcon02} alt="Token Staking" />
              </div>
              <div className="foresight-features-content">
                <h3 className="foresight-features-heading">Token <span>Staking Rewards</span></h3>
                <p className="foresight-features-description">Stake ecosystem tokens and participate in long-term growth while earning blockchain-powered rewards.</p>
              </div>
            </motion.div>
          </div>

          {/* Card 3 */}
          <div className="foresight-features-col-4">
            <motion.div 
              className="foresight-features-card foresight-features-card-vertical"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="foresight-features-icon">
                <img src={featuresIcon03} alt="DAO" />
              </div>
              <div className="foresight-features-content">
                <h3 className="foresight-features-heading">DAO <span>Participation</span></h3>
                <p className="foresight-features-description">Join decentralized governance proposals and shape the future of the ecosystem together.</p>
              </div>
            </motion.div>
          </div>

          {/* Card 4 */}
          <div className="foresight-features-col-4">
            <motion.div 
              className="foresight-features-card foresight-features-card-vertical"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="foresight-features-icon">
                <img src={featuresIcon04} alt="Treasury" />
              </div>
              <div className="foresight-features-content">
                <h3 className="foresight-features-heading">Treasury <span>Transparency</span></h3>
                <p className="foresight-features-description">Access transparent treasury records and ecosystem activity secured through blockchain technology.</p>
              </div>
            </motion.div>
          </div>

          {/* Card 5 */}
          <div className="foresight-features-col-4">
            <motion.div 
              className="foresight-features-card foresight-features-card-vertical"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="foresight-features-icon">
                <img src={featuresIcon05} alt="Community" />
              </div>
              <div className="foresight-features-content">
                <h3 className="foresight-features-heading">Community <span>Powered Growth</span></h3>
                <p className="foresight-features-description">Empower investors, creators, startups and Web3 communities through decentralized collaboration.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="foresight-features-shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default FeaturesSection;