import { Button } from "@/memechan-ui/Atoms/Button";
import Image from "next/image";

export interface InitialDisclaimerProps {
  onConfirm: () => void;
}

const InitialDisclaimer = ({ onConfirm }: InitialDisclaimerProps) => {
  return (
    <div className="rounded-tl-[2px] border-[1px] border-solid border-mono-400">
      <div className=" bg-mono-400 p-[5px] pl-[15px] pr-[15px] flex justify-between items-center">
        <div className="text-yellow-100 font-bold text-[13px] leading-[20px] text-left ">Disclaimer</div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L8 8M14 14L8 8M8 8L14 2L2 14" stroke="white" stroke-width="2" />
        </svg>
      </div>
      <div className="p-[10px] pl-[15px] pr-[15px]">
        <Image src="/cop-pepe.jpg" alt="Cop pepe" height={400} width={400} />
        <div className="text-yellow-100 font-light text-[13px] leading-[20px] text-left p-[15px]">
          I confirm that I am a citizen of Afghanistan, Benin, China, Crimea region, Cuba, Iran, Iraq, Syria, USA,
          Vatican City, or for use by any person in any country or jurisdiction where such distribution or use would be
          contrary to local law or regulation.
        </div>
        <Button variant="primary">Confirm</Button>
      </div>
    </div>
  );
};

export default InitialDisclaimer;
