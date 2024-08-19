import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
import { useTelegram } from "@/utils/telegramProvider";
import { registerMoonGateWallet } from "@moongate/moongate-adapter";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
  WalletConnectWalletAdapterConfig,
} from "@solana/wallet-adapter-wallets";
import React from "react";

const walletConnectConfig: WalletConnectWalletAdapterConfig = {
  network: WalletAdapterNetwork.Mainnet, // or WalletAdapterNetwork.Devnet
  options: {
    projectId: "5468a788eacae3986290c9d75741d519", // Replace with your actual WalletConnect project ID
    metadata: {
      name: "memechan-gg",
      description: "",
      url: "https://solana.memenchan.gg",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  },
};

registerMoonGateWallet({
  authMode: "Google",
  position: "bottom-right",
});
registerMoonGateWallet({
  authMode: "Twitter",
  position: "bottom-right",
});
registerMoonGateWallet({
  authMode: "Apple",
  position: "bottom-right",
});

const allWallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new TrustWalletAdapter(),
  new WalletConnectWalletAdapter(walletConnectConfig),
];

const walletConnectOnly = [new WalletConnectWalletAdapter(walletConnectConfig)];

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useTelegram(); // Get the Telegram user

  const wallets = user ? walletConnectOnly : allWallets; // Conditionally set the wallets

  return (
    <ConnectionProvider endpoint={MEMECHAN_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
