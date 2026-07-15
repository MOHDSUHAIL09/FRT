import React from 'react';
import cryptoIcon1 from '../../assets/img/icon/crypto_icon01.svg';
import cryptoIcon2 from '../../assets/img/icon/crypto_icon02.svg';
import cryptoIcon3 from '../../assets/img/icon/crypto_icon03.svg';

const Foresight = () => {
  // Inline Styles
  const styles = {
    section: {
      padding: '120px 0',
      backgroundColor: '#0a0e17',
      position: 'relative',
      overflow: 'hidden'
    },
    container: {
      width: '100%',
      paddingRight: '15px',
      paddingLeft: '15px',
      marginRight: 'auto',
      marginLeft: 'auto',
      maxWidth: '1140px'
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      marginRight: '-15px',
      marginLeft: '-15px',
      justifyContent: 'center',
      gap: '0' // ✅ Gap row ke through
    },
    // ✅ Heading - Desktop, Tablet, Mobile sab pe center
    colLg8: {
      flex: '0 0 100%',
      maxWidth: '100%',
      paddingRight: '15px',
      paddingLeft: '15px',
      textAlign: 'center'
    },
    // ✅ Card - Desktop: 3 cards, Tablet: 2 cards, Mobile: 1 card
    colLg4: {
      flex: '0 0 100%',
      maxWidth: '100%',
      paddingRight: '15px',
      paddingLeft: '15px'
    },
    sectionTitle: {
      marginBottom: '80px',
      textAlign: 'center'
    },
      // subTitle: {
      //   display: 'inline-block',
      //   fontSize: '14px',
      //   fontWeight: '600',
      //   letterSpacing: '2px',
      //   textTransform: 'uppercase',
      //   color: '#4facfe',
      //   background: 'rgba(79, 172, 254, 0.1)',
      //   padding: '6px 20px',
      //   borderRadius: '30px',
      //   marginBottom: '15px'
      // },
    
      title: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#ffffff',
      lineHeight: '1.2',
      margin: '0'
    },
    titleSpan: {
      color: '#4facfe'
    },
    cryptoItem: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '20px',
      padding: '40px 30px',
      textAlign: 'center',
      transition: 'all 0.4s ease',
      height: '100%',
      backdropFilter: 'blur(10px)',
      cursor: 'pointer',
      width: '100%' // ✅ Full width
    },
    cryptoIcon: {
      width: '80px',
      height: '80px',
      margin: '0 auto 25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(79, 172, 254, 0.08)',
      borderRadius: '50%',
      transition: 'all 0.4s ease'
    },
    cryptoIconImg: {
      maxWidth: '40px',
      height: 'auto'
    },
    cryptoContent: {
      position: 'relative',
      zIndex: '1'
    },
    contentTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '20px',
      lineHeight: '1.3'
    },
 
  };

  // ✅ Responsive Styles - Media Queries with GAP
  const responsiveStyles = `
    /* Desktop - 3 cards in 1 row */
    @media (min-width: 992px) {
      .foresight-col-lg-4 {
        flex: 0 0 33.333333% !important;
        max-width: 33.333333% !important;
        padding: 0 15px !important;
        margin-bottom: 0 !important;
      }
      .foresight-col-lg-8 {
        flex: 0 0 66.666667% !important;
        max-width: 66.666667% !important;
      }
      .foresight-title {
        font-size: 48px !important;
      }
      .foresight-row {
        gap: 0 !important;
      }
    }

    /* Tablet - 2 cards in 1 row */
    @media (min-width: 768px) and (max-width: 991px) {
      .foresight-col-lg-4 {
        flex: 0 0 50% !important;
        max-width: 50% !important;
        padding: 0 15px !important;
        margin-bottom: 30px !important;
      }
      .foresight-title {
        font-size: 34px !important;
      }
      .foresight-item {
        padding: 30px 20px !important;
      }
      .foresight-section {
        padding: 80px 0 !important;
      }
    }

    /* Mobile - 1 card in 1 row */
    @media (max-width: 767px) {
      .foresight-col-lg-4 {
        flex: 0 0 100% !important;
        max-width: 100% !important;
        padding: 0 15px !important;
        margin-bottom: 30px !important;
      }
      .foresight-title {
        font-size: 28px !important;
      }
      .foresight-section {
        padding: 60px 0 !important;
      }
      .foresight-icon {
        width: 65px !important;
        height: 65px !important;
      }
      .foresight-icon img {
        max-width: 32px !important;
      }
      .foresight-content-title {
        font-size: 18px !important;
      }
      .foresight-btn {
        font-size: 12px !important;
        padding: 10px 25px !important;
      }
      .foresight-sub-title {
        font-size: 12px !important;
        padding: 4px 15px !important;
      }
      .foresight-section-title {
        margin-bottom: 50px !important;
      }
    }

    /* Small Mobile */
    @media (max-width: 575px) {
      .foresight-title {
        font-size: 24px !important;
      }
      .foresight-item {
        padding: 25px 15px !important;
      }
      .foresight-content-title {
        font-size: 16px !important;
      }
      .foresight-icon {
        width: 55px !important;
        height: 55px !important;
        margin-bottom: 15px !important;
      }
      .foresight-icon img {
        max-width: 28px !important;
      }
      .foresight-btn {
        font-size: 11px !important;
        padding: 8px 20px !important;
      }
    }

    /* Hover Effects */
    .foresight-item:hover {
      transform: translateY(-10px) !important;
      border-color: rgba(79, 172, 254, 0.3) !important;
      box-shadow: 0 20px 60px rgba(79, 172, 254, 0.1) !important;
    }

    .foresight-item:hover .foresight-icon {
      transform: scale(1.1) rotate(5deg) !important;
      background: rgba(79, 172, 254, 0.15) !important;
    }

    .foresight-btn:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 30px rgba(79, 172, 254, 0.4) !important;
    }
  `;

  return (
    <>
      {/* ✅ Inject Responsive Styles */}
      <style>{responsiveStyles}</style>
      
      <section style={styles.section} className="foresight-section">
        <div style={styles.container}>
          {/* Row 1 - Heading */}
          <div style={styles.row} className="foresight-row">
            <div style={styles.colLg8} className="foresight-col-lg-8">
              <div style={styles.sectionTitle} className="foresight-section-title">
                <span style={styles.subTitle} className="foresight-sub-title">FORESIGHT ECOSYSTEM HUB</span>
                <h2 style={styles.title} className="foresight-title">
                  Governance, <span style={styles.titleSpan}>Transparency</span> & <br /> Community Participation
                </h2>
              </div>
            </div>
          </div>

          {/* Row 2 - 3 Cards in 1 Row (Responsive with Gap) */}
          <div style={styles.row} className="foresight-row">
            
            {/* Card 1 */}
            <div style={styles.colLg4} className="foresight-col-lg-4">
              <div style={styles.cryptoItem} className="foresight-item">
                <div style={styles.cryptoIcon} className="foresight-icon">
                  <img style={styles.cryptoIconImg} src={cryptoIcon1} alt="Whitepaper" />
                </div>
                <div style={styles.cryptoContent}>
                  <h2 style={styles.contentTitle} className="foresight-content-title">
                    Explore the <span style={styles.highlight}>Whitepaper</span>
                  </h2>
                  <a href="#!" style={styles.btn} className="foresight-btn">
                    READ DOCUMENTATION
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div style={styles.colLg4} className="foresight-col-lg-4">
              <div style={styles.cryptoItem} className="foresight-item">
                <div style={styles.cryptoIcon} className="foresight-icon">
                  <img style={styles.cryptoIconImg} src={cryptoIcon2} alt="Token Utility" />
                </div>
                <div style={styles.cryptoContent}>
                  <h2 style={styles.contentTitle} className="foresight-content-title">
                    Token Utility & <span style={styles.highlight}>Governance Model</span>
                  </h2>
                  <a href="#!" style={styles.btn} className="foresight-btn">
                    VIEW TOKENOMICS
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div style={styles.colLg4} className="foresight-col-lg-4">
              <div style={styles.cryptoItem} className="foresight-item">
                <div style={styles.cryptoIcon} className="foresight-icon">
                  <img style={styles.cryptoIconImg} src={cryptoIcon3} alt="Community DAO" />
                </div>
                <div style={styles.cryptoContent}>
                  <h2 style={styles.contentTitle} className="foresight-content-title">
                    Join the <span style={styles.highlight}>Community DAO</span>
                  </h2>
                  <a href="#!" style={styles.btn} className="foresight-btn">
                    BECOME A MEMBER
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default Foresight;