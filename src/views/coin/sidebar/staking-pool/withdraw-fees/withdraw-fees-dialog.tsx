import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { WithdrawFeesDialogProps } from "../../../coin.types";
import { WithdrawFeesPopUp } from "./withdraw-pop-up";

export const WithdrawFeesDialog = (props: WithdrawFeesDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onWithdrawClick = () => {
    setIsOpen(true);
    track("WithdrawClick");
  };

  return (
    <div>
      <Button variant="secondary" onClick={onWithdrawClick} className="px-4">
        <Typography variant="text-button" color="primary-100">
          Withdraw Fees
        </Typography>
      </Button>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        className="fixed inset-0 flex mx-2 items-center justify-center bg-[#19191957] backdrop-blur-[0.5px] z-50"
      >
        {isOpen && (
          <div className="w-full md:w-1/2 md:mx-auto">
            <WithdrawFeesPopUp
              {...props}
              closePopUp={() => {
                setIsOpen(false);
              }}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
};
