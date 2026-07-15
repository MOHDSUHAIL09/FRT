import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


// Image Imports
import workImg from '../../assets/img/images/work_img.png';
import featuresShape from '../../assets/img/images/features_shape.png';

const WorkSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section id="work" className="work__area">
      <div className="container">
        {/* Section Title */}
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="section__title text-center">
              <span className="sub-title">How Foresight Works</span>
              <h2 className="title">
                Building The Future Of
                <span className='ms-3'>Decentralized <br/>Governance</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Work Items */}
        <div className="work__item-wrap">
          {/* Center Image */}
          <div className="work__img">
            <img
              src={workImg}
              alt="img"
              className="alltuchtopdown"
            />
          </div>

          <div className="row" style={{display: "flex"}}>
            {/* Left Column */}
            <div className="col-lg-6" data-aos="fade-right" data-aos-delay="0">
              <div className="work__item">
                <h1 className="number">01</h1>
                <h2 className="title">
                  Join The <span>Ecosystem</span>
                </h2>
                <p>
                  Connect your wallet and become part of the Foresight governance
                  ecosystem built for communities, investors, and Web3 innovators.
                </p>
              </div>

              <div className="work__item mb-0">
                <h1 className="number">02</h1>
                <h2 className="title">
                  Stake & <span>Participate</span>
                </h2>
                <p>
                  Stake governance tokens, access ecosystem benefits,
                  and contribute toward long-term platform growth.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="0">
              <div className="work__item work__item-right">
                <h1 className="number">03</h1>
                <h2 className="title">
                  Vote On <span>Proposals</span>
                </h2>
                <p>
                  Participate in decentralized governance by voting on
                  ecosystem decisions and project proposals.
                </p>
              </div>

              <div className="work__item work__item-right mb-0">
                <h1 className="number">04</h1>
                <h2 className="title">
                  Grow The <span>Community</span>
                </h2>
                <p>
                  Support ecosystem expansion, treasury transparency,
                  and long-term value creation through blockchain participation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shape Image */}
      <div className="work__shape">
        <img src={featuresShape} alt="shape" />
      </div>
    </section>
  );
};

export default WorkSection;