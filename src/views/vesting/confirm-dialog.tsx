import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { useState } from "react";

export const ConfirmVestingClaimDialog = ({
  claimButtonIsDisabled,
  isClaiming,
  claim,
}: {
  claimButtonIsDisabled: boolean;
  isClaiming: boolean;
  claim: () => {};
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="w-fit">
        <Button
          className="max-xxs:self-center bg-regular bg-opacity-80 hover:bg-opacity-50 text-xs font-bold text-white mt-4 disabled:opacity-50"
          disabled={claimButtonIsDisabled}
        >
          {isClaiming ? "Claiming..." : "Claim"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-regular mb-2 lowercase">Vesting Claim Confirmation</DialogTitle>
          <DialogDescription className="text-regular">
            by claiming $CHAN you are reducing your share in revenue sharing program with presale investors, are you
            sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              claim();
            }}
            className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50"
          >
            <span className="text-xs font-bold text-white">yes, I&apos;m sure</span>
          </Button>
          <Button onClick={() => setIsOpen(false)} className="w-full bg-regular bg-opacity-80 hover:bg-opacity-50">
            <span className="text-xs font-bold text-white">no, I&apos;ll keep making profit</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
