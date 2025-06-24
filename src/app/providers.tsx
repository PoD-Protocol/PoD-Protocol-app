'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import wallet CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      dark: '#5855eb',
      light: '#8b5cf6',
    },
    secondary: {
      main: '#e879f9',
      dark: '#d946ef',
      light: '#f3e8ff',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(17, 24, 39, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"',
    h1: {
      fontWeight: 900,
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 800,
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: '0.95rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}