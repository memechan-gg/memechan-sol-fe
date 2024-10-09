import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { formatNumber } from "@/utils/formatNumber";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MEMECHAN_MEME_TOKEN_DECIMALS } from "@rinegade/memechan-sol-sdk";
import { Dialog } from "@reach/dialog";
import BigNumber from "bignumber.js";
import { useTheme } from "next-themes";
import { useState } from "react";
import { UnavailableTicketsToSellDialogParams } from "../../coin.types";

export const UnavailableTicketsToSellDialog = ({
  unavailableTickets,
  symbol,
}: UnavailableTicketsToSellDialogParams) => {
  const { theme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  return (
    <>
      <Button
        onClick={() => {
          setIsDialogOpen(true);
        }}
        variant="primary"
      >
        <div className="text-xs font-bold text-white">Locked Tickets</div>
      </Button>
      <Dialog
        isOpen={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-mono-200 md:bg-[#19191957] md:backdrop-blur-[0.5px] md:z-50"
      >
        <div className="max-w-xl max-h-full mx-2 overflow-auto bg-mono-200 shadow-ligsht">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"}>
                  Locked Tickets
                </Typography>
                <div>
                  <Divider vertical className={`ml-1 ${theme === "light" ? "bg-mono-200" : "bg-mono-500"}`} />
                  <Typography
                    onClick={() => {
                      setIsDialogOpen(false);
                    }}
                    className="pl-1 mt-[2px]"
                  >
                    <FontAwesomeIcon icon={faClose} color="white" fontSize={20} />
                  </Typography>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-col gap-4">
                {unavailableTickets.map((ticket, index) => {
                  const memeTicketLink = `https://explorer.solana.com/address/${ticket.id.toString()}`;
                  const unlockTimestampInMs = new BigNumber(ticket.jsonFields.untilTimestamp)
                    .multipliedBy(1000)
                    .toNumber();

                  return (
                    <div key={index} className="flex justify-between flex-row gap-5 text-xs font-bold text-regular">
                      <a target="_blank" href={memeTicketLink}>
                        <Typography variant="h4" color={theme === "light" ? "mono-600" : "mono-600"}>
                          {index + 1}. {ticket.id.toString().slice(0, 5)}...{ticket.id.toString().slice(-3)}
                        </Typography>
                      </a>
                      <div>
                        <Typography variant="h4" color={theme === "light" ? "mono-600" : "mono-600"}>
                          {formatNumber(+ticket.amountWithDecimals, MEMECHAN_MEME_TOKEN_DECIMALS)} {symbol}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h4" color={theme === "light" ? "mono-600" : "mono-600"}>
                          Unlocks at: {new Date(unlockTimestampInMs).toLocaleDateString()}{" "}
                          {new Date(unlockTimestampInMs).toLocaleTimeString()}{" "}
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>{" "}
        </div>
      </Dialog>
    </>
  );
};
