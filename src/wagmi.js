import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  mainnet, 
  sepolia,
  bsc, // 🔥 BSC IMPORT
} from 'wagmi/chains';

const projectId = '5447aae0bc64a87aa7537cc7228f4a02';

export const config = getDefaultConfig({
  appName: 'FRT Protocol',
  projectId: projectId,
  chains: [bsc, mainnet, sepolia], 
  ssr: false,
});