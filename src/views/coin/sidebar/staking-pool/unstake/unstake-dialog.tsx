import { Button } from "@/components/button";
import { Dialog, DialogTrigger } from "@/components/dialog";
import { useState } from "react";
import { UnstakeDialogProps } from "../../../coin.types";
import { UnstakePopUp } from "./unstake-pop-up";

export const UnstakeDialog = (props: UnstakeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
          <div className="text-xs font-bold text-white">Unstake Token</div>
        </Button>
      </DialogTrigger>
      {isOpen && <UnstakePopUp {...props} />}
    </Dialog>
  );
};
