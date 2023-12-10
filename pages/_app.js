import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  polygonMumbai,
  celoAlfajores,
  arbitrumGoerli,
  baseGoerli,
  scrollSepolia,
  
} from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { ThemeProvider } from "styled-components";
import { ThorinGlobalStyles, darkTheme } from "@ensdomains/thorin";
import { ChakraProvider, Box, Heading, Flex, Text } from "@chakra-ui/react";

import { Chain } from "wagmi";

export const mumbai = {
  id: 80001,
  name: "mumbai",
  network: "mumbai",
  nativeCurrency: {
    decimals: 18,
    name: "matic",
    symbol: "matic",
  },
  rpcUrls: {
    public: { http: ["https://polygon-testnet.public.blastapi.io"] },
    default: { http: ["https://polygon-testnet.public.blastapi.io"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
};

export const scroll = {
  id: 534351,
  name: "Scroll Sepolia",
  network: "Scroll Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "eth",
    symbol: "eth",
  },
  rpcUrls: {
    public: { http: ["https://sepolia-rpc.scroll.io"] },
    default: { http: ["https://sepolia-rpc.scroll.io"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
};

export const arbitrum = {
  id: 421614,
  name: "Arbitrum Sepolia Testnet",
  network: "Arbitrum Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "eth",
    symbol: "eth",
  },
  rpcUrls: {
    public: { http: ["https://sepolia-rollup.arbitrum.io/rpc"] },
    default: { http: ["https://sepolia-rollup.arbitrum.io/rpc"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: "https://sepolia.arbiscan.io" },
    default: { name: "SnowTrace", url: "https://sepolia.arbiscan.io" },
  },
};

export const base = {
  id: 84531,
  name: "Base Goerli",
  network: "Base Goerl",
  nativeCurrency: {
    decimals: 18,
    name: "eth",
    symbol: "eth",
  },
  rpcUrls: {
    public: { http: ["https://goerli.base.org"] },
    default: { http: ["https://goerli.base.org"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: " https://goerli.basescan.org" },
    default: { name: "SnowTrace", url: " https://goerli.basescan.org" },
  },
};


export const mantle = {
  id: 5001,
  name: "Mantle testnet",
  network: "Mantle testne",
  nativeCurrency: {
    decimals: 18,
    name: "mnt",
    symbol: "mnt",
  },
  rpcUrls: {
    public: { http: ["https://rpc.testnet.mantle.xyz"] },
    default: { http: ["https://rpc.testnet.mantle.xyz"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: "https://explorer.mantle.xyz/" },
    default: { name: "SnowTrace", url: "https://explorer.mantle.xyz/" },
  },
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mumbai, celoAlfajores, arbitrum, base, scrollSepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "PeerPurse",
  projectId: "YOUR_PROJECT_ID",
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
            <Box
              minH="100vh"
              bg="#282c34"
              color="white"
              display="flex"
              flexDirection="column"
            >
              <Flex as="main" flex="1" align="center" direction="column">
                <Component {...pageProps} />
              </Flex>
              <Box
                as="footer"
                p="1rem"
                borderTop="1px solid #444c5d"
                bg="#1e232b"
                textAlign="center"
              >
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
