import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai,
  celoAlfajores,
  arbitrumGoerli,
  baseGoerli,
  gnosisChiado,
  neonDevnet,
  scrollSepolia
} from 'wagmi/chains';

import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider } from 'styled-components';
import { ThorinGlobalStyles, darkTheme } from '@ensdomains/thorin';
import { ChakraProvider, Box, Heading, Flex, Text } from '@chakra-ui/react';

import { Chain } from 'wagmi'

export const mumbai = {
  id: 80001,
  name: 'mumbai',
  network: 'mumbai',
  nativeCurrency: {
    decimals: 18,
    name: 'matic',
    symbol: 'matic',
  },
  rpcUrls: {
    public: { http: ['https://polygon-testnet.public.blastapi.io'] },
    default: { http: ['https://polygon-testnet.public.blastapi.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
} 


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
mumbai,
    celoAlfajores,
    arbitrumGoerli,
    baseGoerli,
    gnosisChiado,
    neonDevnet,
    scrollSepolia
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'PeerPurse',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ThemeProvider theme={darkTheme}>
        <ThorinGlobalStyles />
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <Box minH="100vh" bg="#282c34" color="white" display="flex" flexDirection="column">
              <Flex as="header" p="1.5rem" borderBottom="1px solid #444c5d" bg="#1e232b" align="center" justify="center" direction="column">
                <Heading fontSize="2rem" color="#61dafb">
                  PeerPurse
                </Heading>
                <Text color="white">Lending and Borrowing Made Easy</Text>
              </Flex>
              <Flex as="main" flex="1" p="1.5rem" align="center" direction="column">
                <Component {...pageProps} />
              </Flex>
              <Box as="footer" p="1rem" borderTop="1px solid #444c5d" bg="#1e232b" textAlign="center">
                <Text fontSize="0.9rem" color="#888">
                  &copy; 2023 PeerPurse
                </Text>
              </Box>
            </Box>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
