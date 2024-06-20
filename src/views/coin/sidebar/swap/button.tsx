import { Button } from "@/components/button";
import { cn } from "@/utils";
import { SwapButtonProps } from "../../coin.types";

export const SwapButton = ({ mainTokenToMeme, onClick, label }: SwapButtonProps) => (
  <Button
    disabled={mainTokenToMeme}
    onClick={onClick}
    className={cn(
      "w-full py-3",
      !mainTokenToMeme ? "bg-opacity-50 hover:bg-opacity-40" : "bg-opacity-100 hover:bg-opacity-100",
    )}
  >
    <div className="text-xs font-bold text-white">{label}</div>
  </Button>
);
