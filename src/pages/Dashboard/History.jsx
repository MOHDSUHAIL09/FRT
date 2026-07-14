import React from 'react';

const History = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Transaction History</h1>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
        <p className="text-zinc-400">Your transaction history will appear here.</p>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <span className="text-zinc-400">Swap</span>
            <span className="text-emerald-400">+250 FRT</span>
            <span className="text-zinc-500 text-sm">2 mins ago</span>
          </div>
          <div className="flex justify-between p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <span className="text-zinc-400">Stake</span>
            <span className="text-amber-400">+500 FRT</span>
            <span className="text-zinc-500 text-sm">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ YEH ADD KARO - DEFAULT EXPORT
export default History;