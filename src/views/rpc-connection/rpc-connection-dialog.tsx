import { Dialog, DialogTrigger } from "@/components/dialog";
import { useState } from "react";
import { RpcConnectionPopUp } from "./rpc-connection-pop-up";

export const RpcConnectionDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className=" mt-14 sm:mt-2  w-full font-bold text-xs text-left p-2 hover:text-white">
        <div
          role="button"
          className=" bg-dark-background font-bold text-white w-full text-regular text-xs text-left hover:text-white rounded flex items-center space-x-[12px]"
        >
          <span>🐓</span>
          <span>RPC Connection</span>
        </div>
      </DialogTrigger>
      {isOpen && <RpcConnectionPopUp />}
    </Dialog>
  );
};
