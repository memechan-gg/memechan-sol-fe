import { Dialog, DialogTrigger } from "@/components/dialog";
import { useState } from "react";
import { RpcConnectionPopUp } from "./rpc-connection-pop-up";

export const RpcConnectionDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="bg-white w-full text-regular text-xs text-left p-2 hover:bg-regular hover:text-white">
        RPC Connection
      </DialogTrigger>
      {isOpen && <RpcConnectionPopUp />}
    </Dialog>
  );
};
