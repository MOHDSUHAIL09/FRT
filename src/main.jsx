import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import '@rainbow-me/rainbowkit/styles.css';


import './assets/css/main.css'
// import './assets/css/swiper-bundle.min.css'
// import './assets/css/fontawesome-all.min.css'
// import './assets/css/default.css'
// import './assets/css/default-icons.css'
// import './assets/css/bootstrap.min.css'
// import './assets/css/aos.css'
// import './assets/css/animate.min.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BrowserRouter>  {/* ✅ SIRF YAHAN */}
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);