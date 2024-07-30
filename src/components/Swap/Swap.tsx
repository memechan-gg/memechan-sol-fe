import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { Button } from "@/memechan-ui/Atoms";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import DownArrowIcon from "@/memechan-ui/icons/DownArrowIcon";
import UpArrowIcon from "@/memechan-ui/icons/UpArrowIcon";
import { Card } from "@/memechan-ui/Molecules";
import { handleSlippageInputChange } from "@/views/coin/sidebar/swap/utils";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@reach/dialog";
import { PublicKey } from "@solana/web3.js";
import { ChangeEvent, useState } from "react";
import { WithConnectedWallet } from "../WithConnectedWallet";
import { Claim } from "./Claim/Claim";

interface SwapProps {
  variant: "LIVE" | "PRESALE";
  slippage: string;
  refresh: () => void;
  baseCurrency: {
    currencyName: string;
    currencyLogoUrl: string;
    coinBalance: number;
  };
  secondCurrency: {
    currencyName: string;
    currencyLogoUrl: string;
    coinBalance: number;
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputAmount: string;
  publicKey: PublicKey | null;

  isSwapping?: boolean;
  isLoadingOutputAmount?: boolean;
  onSwap: () => Promise<void>;
  onReverseClick: () => void;
  toReceive: string;
  swapButtonIsDisabled?: boolean;
  setSlippage: (e: string) => void;
  stakingPoolFromApi?: ReturnType<typeof useStakingPoolFromApi>["data"];
  seedPoolAddress?: string;
  livePoolId?: string;
  tokenSymbol: string;
}

export const Swap = (props: SwapProps) => {
  const {
    slippage,
    refresh,
    baseCurrency,
    secondCurrency,
    onInputChange,
    inputAmount,
    publicKey,
    isLoadingOutputAmount,
    isSwapping,
    onReverseClick,
    onSwap,
    toReceive,
    swapButtonIsDisabled,
    setSlippage,
    variant: claimVariant,
    tokenSymbol,
    seedPoolAddress,
    livePoolId,
    stakingPoolFromApi,
  } = props;

  const [variant, setVariant] = useState<"swap" | "claim">("swap");
  const [localSlippage, setLocalSlippage] = useState(slippage);
  const isVariantSwap = variant === "swap";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card additionalStyles="min-h-[392px] bg-mono-200">
        <Card.Header>
          <div className="flex justify-between w-full">
            <div className="flex gap-1">
              <Typography variant="h4" onClick={() => setVariant(isVariantSwap ? "swap" : "claim")}>
                {isVariantSwap ? "Swap" : "Claim"}
              </Typography>
              {livePoolId && (
                <Typography
                  variant="text-button"
                  underline
                  onClick={() => setVariant(isVariantSwap ? "claim" : "swap")}
                >
                  {isVariantSwap ? "Claim" : "Swap"}
                </Typography>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Typography variant="text-button" color="mono-500" underline onClick={() => setIsOpen(true)}>
                Slippage {slippage}%
              </Typography>
              <Typography onClick={refresh}>🔄</Typography>
              {/* <Divider vertical className="bg-mono-600" />
                <Typography onClick={onCloseClick}>
                  <FontAwesomeIcon icon={faClose} fontSize={16} />
                </Typography> */}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {variant === "claim" ? (
            <Claim
              variant={claimVariant}
              seedPoolAddress={seedPoolAddress}
              livePoolId={livePoolId}
              stakingPoolFromApi={stakingPoolFromApi}
              tokenSymbol={tokenSymbol}
            />
          ) : (
            <>
              <div className="flex flex-col">
                <SwapInput
                  currencyName={baseCurrency.currencyName}
                  inputValue={inputAmount}
                  setInputValue={onInputChange}
                  placeholder="0.00"
                  currencyLogoUrl={baseCurrency.currencyLogoUrl}
                  label="Pay"
                  labelRight={
                    publicKey ? `👛 ${baseCurrency.coinBalance ?? 0} ${baseCurrency.currencyName}` : undefined
                  }
                />
                <div className="relative h-12">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-mono-400"></div>
                  <div
                    onClick={onReverseClick}
                    className={`absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2  bg-mono-200 hover:bg-mono-300 cursor-pointer border-2 border-mono-400 rounded-sm flex justify-center items-center ${swapButtonIsDisabled && "cursor-not-allowed hover:bg-mono-200"}`}
                  >
                    <DownArrowIcon fill="#979797" />
                    <UpArrowIcon fill="#979797" />
                  </div>
                </div>
                <SwapInput
                  currencyName={secondCurrency.currencyName}
                  type="text"
                  inputValue={toReceive}
                  currencyLogoUrl={secondCurrency.currencyLogoUrl}
                  label="Receive"
                  isReadOnly
                  labelRight={
                    publicKey ? `👛 ${secondCurrency.coinBalance ?? 0} ${secondCurrency.currencyName}` : undefined
                  }
                />
              </div>
              <div className="h-14">
                <WithConnectedWallet
                  variant="primary"
                  className="mt-4 p-1 h-14"
                  disabled={swapButtonIsDisabled || isLoadingOutputAmount}
                  onClick={onSwap}
                  isLoading={isSwapping || isLoadingOutputAmount}
                >
                  <Typography variant="h4">
                    {isLoadingOutputAmount ? "Calculating..." : isSwapping ? "Swapping..." : "Swap"}
                  </Typography>
                </WithConnectedWallet>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-mono-200 md:bg-[#19191957] md:backdrop-blur-[0.5px] md:z-50"
      >
        <Card additionalStyles="max-w-[409px]">
          <Card.Header>
            <div className="flex justify-between items-center w-full">
              <Typography>Slippage Preferences</Typography>
              <FontAwesomeIcon className="cursor-pointer" icon={faClose} onClick={() => setIsOpen(false)} />
            </div>
          </Card.Header>
          <Card.Body>
            <TextInput
              value={localSlippage}
              setValue={setLocalSlippage}
              onChange={(e) => setSlippage(e.target.value)}
            />
            <div className="h-12">
              <Button
                variant="primary"
                className="mt-5"
                onClick={() => {
                  const e = { target: { value: slippage } } as any;
                  handleSlippageInputChange({
                    decimalPlaces: 2,
                    e,
                    setValue: setSlippage,
                    max: MAX_SLIPPAGE,
                    min: MIN_SLIPPAGE,
                  });
                  setSlippage(localSlippage);
                  setIsOpen(false);
                }}
              >
                <Typography variant="h4" color="mono-600">
                  Save
                </Typography>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Dialog>
    </>
  );
};
