import { Dialog, DialogTrigger } from "@/components/dialog";
import { useState } from "react";
import { RpcConnectionPopUp } from "./rpc-connection-pop-up";

export const RpcConnectionDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="sm:mt-2  w-full font-bold text-xs text-left hover:text-white">
        <div
          role="button"
          className=" bg-dark-background font-bold text-white w-full text-regular text-xs text-left hover:text-white rounded flex items-center space-x-[12px] hover:opacity-80"
        >
          <span>🐓</span>
          <span>RPC Connection</span>
        </div>
      </DialogTrigger>
      {isOpen && <RpcConnectionPopUp />}
    </Dialog>
  );
};
