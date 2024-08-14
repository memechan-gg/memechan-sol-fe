import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
import { registerMoonGateWallet } from "@moongate/moongate-adapter";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from "@solana/wallet-adapter-wallets";

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

const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TrustWalletAdapter()];

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint={MEMECHAN_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
