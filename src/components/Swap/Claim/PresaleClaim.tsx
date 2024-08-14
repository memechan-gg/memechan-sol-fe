import { TICKETS_INTERVAL } from "@/config/config";
import { useTickets } from "@/hooks/useTickets";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { parseChainValue } from "@/utils/parseChainValue";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { PresaleClaimProps } from "./types";

export const PresaleClaim = (props: PresaleClaimProps) => {
  const { tokenSymbol, quoteTokenInfo, seedPoolAddress, memePrice } = props;
  const { theme } = useTheme();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(() => {
    return !!Boolean(Cookies.get("isClaimConfirmed"));
  });
  const ticketsData = useTickets({
    poolAddress: seedPoolAddress,
    poolStatus: "PRESALE",
    refreshInterval: TICKETS_INTERVAL,
  });
  return (
    <>
      {!isConfirmed ? (
        <div className="flex flex-col justify-center py-7">
          <Typography variant="h4" color="mono-600" className="">
            Read this carefully and don’t be silly in our telegram
          </Typography>
          <ul className="list-inside list-disc pl-0">
            <Typography variant="body" color="mono-600" className="list-item mt-5">
              By participating in presale on Memechan you will receive tickets and be able to exchange tickets to actual
              tokens after it’s going live.
            </Typography>
            <Typography variant="body" color="mono-600" className="list-item mt-5">
              Your tokens will be linearly vested for 3 days since coin goes live.
            </Typography>
            <Typography variant="body" color="mono-600" className="list-item mt-5">
              Tokens that are not claimed will earn trading fees revenue share for you.
            </Typography>
            <Typography
              variant="body"
              color="green-100"
              className="list-item mt-5"
              onClick={() => {
                Cookies.set("isClaimConfirmed", "true");
                setIsConfirmed(true);
              }}
            >
              You’ll be able to manage it’s all here.
            </Typography>
          </ul>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex w-full border-mono-400 border p-2 gap-4 pr-4 pl-3">
            <div className="text-[10px] mt-[2px]">⚠️</div>
            <div>
              <Typography variant="body" color={theme === "light" ? "yellow-500" : "yellow-100"}>
                Presale is ongoing still. Vesting and revenue sharing will start once the token goes live.
              </Typography>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between mt-4 items-center text-end">
              <Typography variant="body" color="mono-500">
                Staked Amount
              </Typography>
              <div>
                <Typography variant="body" color="mono-600">
                  {ticketsData.status === "pending" ? (
                    <Skeleton
                      width={45}
                      baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                      highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                    />
                  ) : (
                    <>
                      {parseChainValue(+ticketsData.stakedAmount, 0, 2)} {tokenSymbol}
                    </>
                  )}
                </Typography>
                {" / "}
                <Typography variant="body" color="mono-500">
                  {ticketsData.status === "pending" || !memePrice ? (
                    <Skeleton
                      width={45}
                      baseColor={theme === "light" ? "#bc6857" : "#3e3e3e"}
                      highlightColor={theme === "light" ? "#e5ad90" : "#979797"}
                    />
                  ) : (
                    <>${parseChainValue(+ticketsData.stakedAmount * +memePrice, 0, 2)}</>
                  )}
                </Typography>
              </div>
            </div>
            <div className="flex justify-between mt-2 items-center text-end">
              <Typography variant="body" color="mono-500">
                Claimable Amount
              </Typography>
              <div>
                <Typography variant="body" color="mono-600">
                  0 {tokenSymbol}
                </Typography>{" "}
                <Typography variant="body" color="mono-500">
                  / $0.00
                </Typography>
              </div>
            </div>
            <Divider vertical={false} className="mt-4"></Divider>
            <div className="flex justify-between mt-4 items-center text-end">
              <Typography variant="body" color="mono-500">
                {tokenSymbol} Fees Earned
              </Typography>
              <div>
                <Typography variant="body" color="mono-600">
                  0 {tokenSymbol}
                </Typography>{" "}
                <Typography variant="body" color="mono-500">
                  / $0.00
                </Typography>
              </div>
            </div>
            <div className="flex justify-between mt-2 items-center text-end">
              <Typography variant="body" color="mono-500">
                {quoteTokenInfo?.symbol || "SOL"} Fees Earned
              </Typography>
              <div>
                <Typography variant="body" color="mono-600">
                  0 {quoteTokenInfo?.symbol || "SOL"}
                </Typography>{" "}
                <Typography variant="body" color="mono-500">
                  / $0.00
                </Typography>
              </div>
            </div>
            <div className="flex justify-between mt-2 items-center text-end">
              <Typography variant="body" color="mono-500">
                CHAN Fees Earned
              </Typography>
              <div>
                <Typography variant="body" color="mono-600">
                  0 CHAN
                </Typography>{" "}
                <Typography variant="body" color="mono-500">
                  / $0.00
                </Typography>
              </div>
            </div>
            <div className="flex justify-between mt-4 gap-3 items-center">
              <Button disabled variant="disabled" className="min-h-14">
                <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"} className="text-center">
                  Nothing to Unstake
                </Typography>
              </Button>
              <Button disabled variant="disabled" className="min-h-14">
                <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"} className="text-center">
                  No fees to claim
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
