import React from 'react';

const Profile = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Profile</h1>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
            <span className="text-3xl font-bold text-amber-500">U</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Username</h2>
            <p className="text-zinc-400">crypto_whale</p>
            <p className="text-zinc-500 text-sm">whale@email.com</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <p className="text-zinc-400 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-emerald-400">1,250 FRT</p>
          </div>
          <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <p className="text-zinc-400 text-sm">Referrals</p>
            <p className="text-2xl font-bold text-amber-400">24</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ YEH ADD KARO - DEFAULT EXPORT
export default Profile;