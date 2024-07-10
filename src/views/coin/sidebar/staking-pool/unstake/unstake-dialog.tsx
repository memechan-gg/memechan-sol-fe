import { Button } from "@/components/button";
import { Dialog, DialogTrigger } from "@/components/dialog";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { UnstakeDialogProps } from "../../../coin.types";
import { UnstakePopUp } from "./unstake-pop-up";

export const UnstakeDialog = (props: UnstakeDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onUnstakeClick = () => {
    track("UnstakeClick");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50" onClick={onUnstakeClick}>
          <div className="text-xs font-bold text-white">Unstake Token</div>
        </Button>
      </DialogTrigger>
      {isOpen && <UnstakePopUp {...props} />}
    </Dialog>
  );
};
