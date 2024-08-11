import { Dialog, DialogTrigger } from "@/components/dialog";
import { useTheme } from "next-themes";
import { useState } from "react";
import { RpcConnectionPopUp } from "./rpc-connection-pop-up";

export const RpcConnectionDialog = ({ onClick }: { onClick: () => void }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme } = useTheme();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger className="w-full font-bold text-xs text-left sm:hover:text-white">
        <div
          role="button"
          className="min-h-14 sm:mt-2 bg-dark-background font-bold  w-full text-xs text-left sm:hover:text-white rounded flex items-center space-x-[12px] sm:hover:opacity-80  sm:min-h-12"
        >
          <span>🐓</span>
          <span className={theme === "light" ? "mono-400" : "white"}>RPC Connection</span>
        </div>
      </DialogTrigger>
      {isOpen && <RpcConnectionPopUp />}
    </Dialog>
  );
};
