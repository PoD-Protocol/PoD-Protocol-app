'use client';

import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useMemo, useEffect, useState } from 'react';
import { PodComClient, PodComConfig } from '@pod-protocol/sdk';
import { PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';

// Extended client interface for secure cleanup functionality
interface ExtendedPodComClient extends PodComClient {
  secureCleanup?: () => void;
}

export default function usePodClient() {
  const wallet = useAnchorWallet();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const client = useMemo(() => {
    const config: PodComConfig = {};

    if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
      config.endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    }

    if (process.env.NEXT_PUBLIC_PROGRAM_ID) {
      try {
        config.programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
      } catch (err) {
        console.warn('Invalid NEXT_PUBLIC_PROGRAM_ID', err);
      }
    }

    if (process.env.NEXT_PUBLIC_LIGHT_RPC_URL) {
      config.zkCompression = {
        lightRpcUrl: process.env.NEXT_PUBLIC_LIGHT_RPC_URL,
      };
    }

    // Disable IPFS in browser environments to avoid native module issues
    if (typeof window !== 'undefined') {
      config.ipfs = {
        disabled: true
      };
    }

    return new PodComClient(config);
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initializeClient = async () => {
      try {
        setInitError(null);
        setIsInitialized(false);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await client.initialize(wallet as any);
        
        if (mounted) {
          setIsInitialized(true);
          console.log('PoD client initialized successfully');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Failed to initialize PoD client:', err);
        
        if (mounted) {
          setInitError(errorMessage);
          
          // Show user-friendly error message
          if (errorMessage.includes('network')) {
            toast.error('Network connection failed. Please check your internet connection.');
          } else if (errorMessage.includes('wallet')) {
            toast.error('Wallet connection failed. Please ensure your wallet is connected.');
          } else {
            toast.error('Failed to initialize PoD client. Please try refreshing the page.');
          }
        }
      }
    };

    initializeClient();
  
    return () => {
      mounted = false;
      // Cleanup client on unmount
      if (client && typeof (client as ExtendedPodComClient).secureCleanup === 'function') {
        try {
          (client as ExtendedPodComClient).secureCleanup?.();
        } catch (err) {
          console.warn('Error during client cleanup:', err);
        }
      }
    };
  }, [client, wallet]);

  return {
    client,
    isInitialized,
    initError,
    retry: () => {
      // Force re-initialization by updating a dependency
      setInitError(null);
      setIsInitialized(false);
    }
  };
}
