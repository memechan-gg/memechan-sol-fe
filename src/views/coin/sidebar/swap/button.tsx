import { Button } from "@/components/button";
import { cn } from "@/utils";
import { SwapButtonProps } from "../../coin.types";

export const SwapButton = ({ slerfToMeme, onClick, label }: SwapButtonProps) => (
  <Button
    disabled={slerfToMeme}
    onClick={onClick}
    className={cn(
      "w-full py-3",
      !slerfToMeme ? "bg-opacity-50 hover:bg-opacity-40" : "bg-opacity-100 hover:bg-opacity-100",
    )}
  >
    <div className="text-xs font-bold text-white">{label}</div>
  </Button>
);
