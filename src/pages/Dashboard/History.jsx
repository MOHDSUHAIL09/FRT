import React from 'react';

const History = ({ transactions = [] }) => {
  // Sample transactions if none provided
  const sampleTransactions = [
    {
      id: 1,
      type: 'SWAP',
      from: '0x1234...5678',
      to: '0x8765...4321',
      amount: '250.00',
      token: 'FRT',
      date: '2 mins ago',
      status: 'COMPLETED'
    },
    {
      id: 2,
      type: 'STAKE',
      from: '0xabcd...efgh',
      to: '0xijkl...mnop',
      amount: '500.00',
      token: 'FRT',
      date: '1 hour ago',
      status: 'COMPLETED'
    },
    {
      id: 3,
      type: 'CLAIM',
      from: '0xqrst...uvwx',
      to: '0xyzz...1234',
      amount: '75.50',
      token: 'FRT',
      date: '3 hours ago',
      status: 'PENDING'
    },
    {
      id: 4,
      type: 'BOND',
      from: '0x9876...5432',
      to: '0x1357...2468',
      amount: '1000.00',
      token: 'FRT',
      date: '5 hours ago',
      status: 'COMPLETED'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : sampleTransactions;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Transaction History</h1>
      
      {/* Table Container - Same as DashboardView */}
      <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">S.No</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">From</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">To</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Token</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-zinc-500">
                    <div className="text-6xl mb-1" style={{marginTop: "80px"}}>📭</div>
                    <p className="text-[20px]">No transactions yet</p>
                    <p className="text-[18px] text-zinc-600 mt-0.5">Start swapping to see your history</p>
                  </td>
                </tr>
              ) : (
                displayTransactions.map((tx, index) => (
                  <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all">
                    <td className="py-3 px-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-[12px] font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-lg font-bold text-[12px] ${
                        tx.type === 'STAKE' ? 'bg-amber-500/10 text-amber-500' :
                        tx.type === 'CLAIM' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.type === 'BOND' ? 'bg-cyan-500/10 text-cyan-400' :
                        tx.type === 'SWAP' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {tx.type || 'TX'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 text-[11px] font-mono">
                      {tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : '---'}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 text-[11px] font-mono">
                      {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : '---'}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 font-mono text-[12px] font-bold">
                      {tx.amount || '0'}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 text-[11px] font-bold">
                      {tx.token || 'FRT'}
                    </td>
                    <td className="py-3 px-3 text-zinc-500 text-[10px]">
                      {tx.date || 'Just now'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                        tx.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {tx.status || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ✅ DEFAULT EXPORT
export default History;