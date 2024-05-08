import { Button } from "@/components/button";
import { cn } from "@/utils";
import { SwapButtonProps } from "../../coin.types";

export const SwapButton = ({ isXToY, onClick, label }: SwapButtonProps) => (
  <Button
    disabled={isXToY}
    onClick={onClick}
    className={cn("w-full py-3", !isXToY ? "bg-opacity-50 hover:bg-opacity-40" : "bg-opacity-100 hover:bg-opacity-100")}
  >
    <div className="text-xs font-bold text-white">{label}</div>
  </Button>
);
