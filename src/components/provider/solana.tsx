import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
import { registerMoonGateWallet } from "@moongate/moongate-adapter";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from "@solana/wallet-adapter-wallets";

registerMoonGateWallet({
  authMode: "Google",
  position: "top-right",
  logoDataUri: "OPTIONAL ADD IN-WALLET LOGO URL HERE",
  buttonLogoUri: "ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE",
});
registerMoonGateWallet({
  authMode: "Twitter",
  position: "top-right",
  logoDataUri: "OPTIONAL ADD IN-WALLET LOGO URL HERE",
  buttonLogoUri: "ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE",
});
registerMoonGateWallet({
  authMode: "Apple",
  position: "top-right",
  logoDataUri: "OPTIONAL ADD IN-WALLET LOGO URL HERE",
  buttonLogoUri: "ADD OPTIONAL LOGO FOR WIDGET BUTTON HERE",
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
