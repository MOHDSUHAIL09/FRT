import React from 'react';

// Import images
import logo from '../../assets/img/logo/logo.png';
import iconsBg from '../../assets/img/icon/icons_bg.svg';
import facebookIcon from '../../assets/img/icon/facebook.svg';
import twitterIcon from '../../assets/img/icon/twitter.svg';
import telegramIcon from '../../assets/img/icon/telegram.svg';
import shape1 from '../../assets/img/icon/footer_shape01.png';
import shape2 from '../../assets/img/icon/footer_shape02.png';

const Footer = () => {
  return (
    <footer className="footer__area bg-clr" id="Contact">
        <div className="footer__top">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="footer__content">
                <div className="footer__logo" style={{display: "flex", justifyContent: "center"}}>
                  <a href="/">
                    <img 
                      src={logo} 
                      width="300" 
                      alt="Foresight Logo" 
                    />
                  </a>
                </div>

                <span className="sub-title">
                  Foresight — Foresight Future Freedom
                </span>

                <h2 className="title">
                  Join the <span>decentralized <br/>future</span> of Web3
                </h2>
                
                <div className="team__social-wrap">
                  <ul className="list-wrap">
                    <li>
                      <a href="#!" aria-label="Facebook">
                        <div className="shape">
                          <img src={iconsBg} alt="shape" />
                        </div>
                        <img src={facebookIcon} alt="Facebook icon" className="icon" />
                      </a>
                    </li>
                    <li>
                      <a href="#!" aria-label="Twitter">
                        <div className="shape">
                          <img src={iconsBg} alt="shape" />
                        </div>
                        <img src={twitterIcon} alt="Twitter icon" className="icon" />
                      </a>
                    </li>
                    <li>
                      <a href="#!" aria-label="Telegram">
                        <div className="shape">
                          <img src={iconsBg} alt="shape" />
                        </div>
                        <img src={telegramIcon} alt="Telegram icon" className="icon" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer__bottom">
          <div className="copyright-text">
            <p className="text-white">
              © 2026 Foresight. All Rights Reserved. |
              Decentralized Governance & Web3 Ecosystem
            </p>
          </div>
        </div>
    
      
      <div className="footer__shape">
        <img 
          src={shape1} 
          alt="Decorative shape" 
          className="alltuchtopdown" 
        />
        <img 
          src={shape2} 
          alt="Decorative shape" 
          className="alltuchtopdown" 
        />
      </div>
    </footer>
  );
};

export default Footer;