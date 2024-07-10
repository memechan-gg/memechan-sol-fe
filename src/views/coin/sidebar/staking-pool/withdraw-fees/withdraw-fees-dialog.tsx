import { Button } from "@/components/button";
import { Dialog, DialogTrigger } from "@/components/dialog";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { WithdrawFeesDialogProps } from "../../../coin.types";
import { WithdrawFeesPopUp } from "./withdraw-pop-up";

export const WithdrawFeesDialog = (props: WithdrawFeesDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onWithdrawClick = () => {
    track("WithdrawClick");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <Button className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50" onClick={onWithdrawClick}>
          <div className="text-xs font-bold text-white">Withdraw Fees</div>
        </Button>
      </DialogTrigger>
      {isOpen && <WithdrawFeesPopUp {...props} />}
    </Dialog>
  );
};
