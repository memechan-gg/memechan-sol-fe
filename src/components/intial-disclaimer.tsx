import { Button } from "@/memechan-ui/Atoms/Button";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import MenuIcon from "@/memechan-ui/icons/MenuIcon";
import Image from "next/image";

export interface InitialDisclaimerProps {
  onConfirm: () => void;
}

const InitialDisclaimer = ({ onConfirm }: InitialDisclaimerProps) => {
  return (
    <div className="rounded-tl-[2px] border-[1px] border-solid border-mono-400">
      <div className="bg-mono-400 p-[5px] px-[10px] flex justify-between items-center">
        <div className="flex justify-between items-center gap-x-1">
          <MenuIcon />
          <Typography variant="h4" color="green-100">
            Disclaimer
          </Typography>
        </div>
        <Typography variant="body" color="mono-500">
          Sup
        </Typography>
      </div>
      <div className="p-[15px]">
        <Image src="/cop-pepe.jpg" alt="Cop pepe" height={400} width={400} />
        <div className="text-left mt-[15px]">
          <Typography variant="body" color="mono-600">
            I confirm that I am a citizen of Afghanistan, Benin, China, Crimea region, Cuba, Iran, Iraq, Syria, USA,
            Vatican City, or for use by any person in any country or jurisdiction where such distribution or use would
            be contrary to local law or regulation.
          </Typography>
        </div>
        <div className="mt-[15px] h-[60px]">
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InitialDisclaimer;
