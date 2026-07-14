import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Users,
  Gift
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ReferModal = ({ isOpen, onClose, referralCode = 'FRT', userAddress = '' }) => {
  const [copied, setCopied] = useState(false);
  
  const referralLink = `http://FRT/signup?ref=FRT`;
  const totalEarnings = 738.066;
  const totalReferrals = 12;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join FRT Finance',
          text: `Join FRT Finance with my referral link: ${referralLink}`,
          url: referralLink,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-[#141416] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Invite Friends</h2>
                    <p className="text-xs text-zinc-400">Earn rewards with referrals</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* QR Code */}
              <div className="p-6 flex flex-col items-center border-b border-zinc-800/50">
                <div className="bg-white p-4 rounded-xl mb-3">
                  <QRCodeSVG 
                    value={referralLink}
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-zinc-400 text-center">
                  Scan QR code to invite friends
                </p>
              </div>

              {/* Referral Link */}
              <div className="p-4">
                <div className="flex items-center gap-2 bg-zinc-900/50 rounded-xl border border-zinc-800 p-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-400 font-medium">Referral Link</p>
                    <p className="text-xs text-white font-mono truncate">
                      {referralLink}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-all text-zinc-300 hover:text-white"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
            
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReferModal;