import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const Refer = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://frt.io/ref/your-code';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Animation variants - sab top se aayenge
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.7,
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-2xl bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-amber-500/5"
      >
        {/* Heading - top se aayega */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
          <motion.span
            initial={{ rotate: -30, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-3xl"
          >

          </motion.span>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 bg-clip-text text-transparent">
            Refer & Earn
          </h1>
        </motion.div>

        {/* Subtitle - top se aayega */}
        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-sm sm:text-base mb-6 ml-1"
        >
          Share your referral link and earn rewards with every sign-up!
        </motion.p>

        {/* Main card - QR + Link - top se aayega */}
        <motion.div
          variants={itemVariants}
          className="bg-zinc-800/40 border border-zinc-700/60 rounded-2xl p-5 sm:p-7"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
    
            <motion.div
              variants={glowVariants}
              className="flex-shrink-0 bg-white p-3 rounded-2xl shadow-lg shadow-amber-500/10 border-2 border-amber-500/20"
            >
              <QRCodeSVG
                value={referralLink}
                size={130}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                  height: 28,
                  width: 28,
                  excavate: true,
                }}
              />
            </motion.div>

            {/* Link + Copy Button */}
            <div className="flex-1 w-full space-y-4">
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-3 sm:p-4 relative group">
                <code className="text-amber-400 text-sm sm:text-base font-mono break-all">
                  {referralLink}
                </code>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                }`}
              >
                {copied ? (
                  <>
                    <i className="fas fa-check-circle" /> Copied!
                  </>
                ) : (
                  <>
                    <i className="fas fa-copy" /> Copy Link
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>




        {/* Decorative animated glow - background me */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"
        />
      </motion.div>
    </div>
  );
};

export default Refer;