import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { UnstakeDialogProps } from "../../../coin.types";
import { UnstakePopUp } from "./unstake-pop-up";

export const UnstakeDialog = (props: UnstakeDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onUnstakeClick = () => {
    setIsOpen(true);
    track("UnstakeClick");
  };

  return (
    <div>
      <Button variant="primary" onClick={onUnstakeClick}>
        <Typography color="mono-600" variant="text-button">
          Unstake Token
        </Typography>
      </Button>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        className="fixed inset-0 flex mx-2 items-center justify-center bg-[#19191957] backdrop-blur-[0.5px] z-50"
      >
        {isOpen && (
          <div className="w-full ßmd:w-1/2 md:mx-auto">
            <UnstakePopUp
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
