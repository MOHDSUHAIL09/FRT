import React from 'react';


// IMAGES IMPORT KARO
import mainImage from '../../assets/img/images/exchange_img.png';
import icon1 from '../../assets/img/icon/exchange_icon01.svg';
import icon2 from '../../assets/img/icon/exchange_icon02.svg';
import icon3 from '../../assets/img/icon/exchange_icon03.svg';
import icon4 from '../../assets/img/icon/exchange_icon04.svg';

const Ecosystem = () => {
  return (
    <section className="exchange__area section-py-120" data-aos="fade-up" data-aos-delay="0" style={{display: "flex", justifyContent: "center"}}>
      <div className="container">
        <div className="exchange__inner-wrap">
          <div className="exchange__content">
            <div className="icon">
              {/* IMPORTED IMAGE USE KARO */}
              <img src={mainImage} alt="img" />
            </div>
            <div className="content">
              <h2 className="title">
                Ecosystem <span>Accessibility</span>
              </h2>
              <p>
                Foresight integrates with Web3 wallets,
                governance modules, and decentralized tools
                to provide seamless access to staking,
                voting, proposals, and treasury participation
                across the ecosystem.
              </p>
            </div>
          </div>
          <div className="exchange__icons">
            <ul className="list-wrap">
              <li>
                <img src={icon1} alt="icon" />
              </li>
              <li>
                <img src={icon2} alt="icon" />
              </li>
              <li>
                <img src={icon3} alt="icon" />
              </li>
              <li>
                <img src={icon4} alt="icon" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;