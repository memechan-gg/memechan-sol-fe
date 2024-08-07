import { Dialog, DialogTrigger } from "@/components/dialog";
import { useState } from "react";
import { RpcConnectionPopUp } from "./rpc-connection-pop-up";

export const RpcConnectionDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="w-full font-bold text-xs text-left sm:hover:text-white">
        <div
          role="button"
          className="min-h-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-xs text-left sm:hover:text-white rounded flex items-center space-x-[12px] sm:hover:opacity-80  sm:min-h-12"
        >
          <span>🐓</span>
          <span>RPC Connection</span>
        </div>
      </DialogTrigger>
      {isOpen && <RpcConnectionPopUp />}
    </Dialog>
  );
};
