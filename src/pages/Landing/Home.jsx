import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Users, 
  TrendingUp,
  Zap,
  ChevronDown,
  Lock,
  Globe,
  BarChart3,
  Coins
} from 'lucide-react';


// OPTION 1: Agar image src/assets/hero01.png mein hai
import heroImage from '../../assets/hero01.png';
// Crypto Illustration Placeholder
const cryptoIllustration = (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-2xl animate-pulse" />
    <div className="relative grid grid-cols-3 gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/20">
        <Coins size={32} className="text-white" />
      </div>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 mt-6">
        <Shield size={32} className="text-white" />
      </div>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
        <TrendingUp size={32} className="text-white" />
      </div>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/20">
        <Lock size={32} className="text-white" />
      </div>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-2xl shadow-pink-500/20 mt-6">
        <Globe size={32} className="text-white" />
      </div>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
        <Zap size={32} className="text-white" />
      </div>
    </div>
  </div>
);

const Hero = ({ onGetStarted, isConnected }) => {
  // Floating particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">    
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.06] via-transparent to-transparent" />
      
      <motion.div 
        className="absolute top-20 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2, ease: "easeInOut" }}
      />
      
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #e0a948 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-amber-500/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 10, -10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* ===== LEFT SIDE - TEXT CONTENT ===== */}
          <div className="text-center lg:text-left">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
              <span className="text-amber-500 text-xs font-bold tracking-wider font-display uppercase">
                Let's Crypto
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-4">
                <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  Secure Investments
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                  Financial Ecosystem
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-base md:text-lg max-w-xl font-light leading-relaxed mb-8 lg:mb-10"
            >
              Unlock the future of finance with our innovative cryptocurrency platform. 
              Seamlessly trade, invest, and grow your digital assets with state-of-the-art security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center lg:justify-start gap-4"
            >
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(248, 185, 78, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onGetStarted('GET_STARTED')}
                    className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-bold text-base px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/25"
                  >
                    <Zap size={18} className="group-hover:rotate-12 transition-transform" />
                    Explore Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-display font-medium text-base px-6 py-4 rounded-full border border-zinc-800 hover:border-zinc-600 transition-all duration-300 backdrop-blur-sm"
                  >
                    How It Work
                    <ChevronDown size={18} />
                  </motion.button>
                </>           
            </motion.div>
          </div>

          {/* ===== RIGHT SIDE - IMAGE ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-lg aspect-square">
              
              {/* 🔥 CORRECT IMAGE TAG */}
              <img 
                src={heroImage}
                alt="Crypto Investment Illustration"
                className="w-full h-full object-contain rounded-2xl"
                onError={(e) => {
                  // Agar image load na ho toh fallback
                  e.target.src = fallbackImage;
                }}
              />

              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;