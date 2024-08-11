import { UserContextType } from "@/context/UserContext";
import { ConnectWallet } from "./connect-wallet";
import SideMenu from "./side-menu";

export const ProfileManagment = (props: { account: UserContextType; disconnect: () => Promise<void> }) => {
  return (
    <div className="h-10 min-w-[137px] flex items-center justify-evenly bg-inherit box-content border border-primary-100 rounded-sm">
      <div className="w-full h-full focus-visible:outline-none">
        <ConnectWallet account={props.account} disconnect={props.disconnect} />
      </div>
      <span className="h-[80%] border-r border-primary-100"></span>
      <div className="w-2/9 h-full focus-visible:outline-none">
        <SideMenu account={props.account} disconnect={props.disconnect} />
      </div>
    </div>
  );
};
