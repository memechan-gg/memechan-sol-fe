import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { useSolanaPrice } from "@/hooks/useSolanaPrice";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import NumberInput from "@/memechan-ui/Atoms/Input/NumberInput";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import DownArrowIcon from "@/memechan-ui/icons/DownArrowIcon";
import UpArrowIcon from "@/memechan-ui/icons/UpArrowIcon";
import { Card } from "@/memechan-ui/Molecules";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@reach/dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { ChangeEvent, useState } from "react";
import { Oval } from "react-loader-spinner";
import { WithConnectedWallet } from "../WithConnectedWallet";
import { Claim } from "./Claim";

interface SwapProps {
  variant: "LIVE" | "PRESALE";
  slippage: string;
  refresh: () => void;
  isRefreshing: boolean;
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
  onClose?: () => void;
  tokenDecimals: number;
  memePrice?: string;
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
    onClose,
    isRefreshing,
    tokenDecimals,
    memePrice,
  } = props;
  const { data: solanaPriceInUSD } = useSolanaPrice();
  const [variant, setVariant] = useState<"swap" | "claim">("swap");
  const [localSlippage, setLocalSlippage] = useState(slippage);
  const isVariantSwap = variant === "swap";
  const { connected } = useWallet();

  const [isOpen, setIsOpen] = useState(false);
  const handleSlippageChange = (value: string) => {
    const decimalPattern = /^\d*\.?\d{0,2}$/;
    if (
      value === "" ||
      (decimalPattern.test(value) && parseFloat(value) <= MAX_SLIPPAGE && parseFloat(value) >= MIN_SLIPPAGE)
    ) {
      setLocalSlippage(value);
    }
  };

  const getUSDPrice = (currecyName: string, amount: string) => {
    if (currecyName === "SOL") {
      if (!solanaPriceInUSD?.price) return undefined;
      return Number(amount) * solanaPriceInUSD.price;
    }
    if (!memePrice || !amount || amount === "0") return undefined;
    const cleanAmount = amount.replace(/,/g, "");
    const result = new BigNumber(memePrice).multipliedBy(new BigNumber(cleanAmount));
    return result.toNumber();
  };
  return (
    <>
      <Card additionalStyles="min-h-[392px] bg-mono-200">
        <Card.Header>
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-center">
              {variant === "swap" ? (
                <>
                  <Typography color="mono-600" variant="h4">
                    Swap
                  </Typography>
                  <Typography variant="text-button" color="mono-500" underline onClick={() => setVariant("claim")}>
                    Claim
                  </Typography>
                </>
              ) : (
                <>
                  <Typography color="mono-500" onClick={() => setVariant("swap")} variant="text-button" underline>
                    Swap
                  </Typography>
                  <Typography variant="h4" color="mono-600">
                    Claim
                  </Typography>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Typography variant="text-button" color="mono-500" underline onClick={() => setIsOpen(true)}>
                Slippage {slippage}%
              </Typography>
              {!isRefreshing ? (
                <Typography className="leading-[13px] text-[10px] border-b-[1px] border-b-mono-500" onClick={refresh}>
                  🔄
                </Typography>
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="15px"
                    width="15px"
                    color="#ffffff"
                    ariaLabel="oval-loading"
                    secondaryColor="#3979797e3e3e"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
              {onClose && (
                <>
                  <Divider vertical className="bg-mono-500 ml-1" />
                  <Typography onClick={onClose} className="pl-1 mt-[2px]">
                    <FontAwesomeIcon icon={faClose} fontSize={20} />
                  </Typography>
                </>
              )}
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
                  baseCurrencyAmount={baseCurrency.coinBalance}
                  showQuickInput={connected}
                  usdPrice={getUSDPrice(baseCurrency.currencyName, inputAmount)}
                  tokenDecimals={tokenDecimals}
                  quickInputNumber={baseCurrency.currencyName === "SOL"}
                />
                <div className="relative h-12">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-mono-400"></div>
                  <div
                    onClick={onReverseClick}
                    className={`absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2  bg-mono-200 sm:hover:bg-mono-300 cursor-pointer border-2 border-mono-400 rounded-sm flex justify-center items-center ${swapButtonIsDisabled ? "cursor-not-allowed sm:hover:bg-mono-200" : ""}`}
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
                  usdPrice={getUSDPrice(secondCurrency.currencyName, toReceive)}
                  labelRight={
                    publicKey ? `👛 ${secondCurrency.coinBalance ?? 0} ${secondCurrency.currencyName}` : undefined
                  }
                  isRefreshing={isLoadingOutputAmount}
                  // usdPrice={solanaPriceInUSD?.price ? Number(inputAmount ?? 0) * solanaPriceInUSD.price : 0}
                />
              </div>

              <WithConnectedWallet
                variant={!connected ? "primary" : inputAmount && !isLoadingOutputAmount ? "primary" : "disabled"}
                className="mt-4 p-1 h-14"
                disabled={swapButtonIsDisabled || isLoadingOutputAmount}
                onClick={onSwap}
                isLoading={isSwapping || isLoadingOutputAmount}
              >
                {!inputAmount ? (
                  <Typography variant="h4">Fill all required fields</Typography>
                ) : (
                  <Typography variant="h4">
                    {isLoadingOutputAmount
                      ? "Loading..."
                      : isSwapping
                        ? "Swapping..."
                        : +inputAmount > baseCurrency.coinBalance
                          ? "Insufficient balance"
                          : "Swap"}
                  </Typography>
                )}
              </WithConnectedWallet>
            </>
          )}
        </Card.Body>
      </Card>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => {
          if (localSlippage === "") {
            setSlippage("0");
          }
          setIsOpen(false);
        }}
        className="fixed inset-0 flex items-center justify-center bg-mono-200 md:bg-[#19191957] md:backdrop-blur-[0.5px] md:z-50"
      >
        <Card additionalStyles="max-w-[409px]">
          <Card.Header>
            <div className="flex justify-between items-center w-full">
              <Typography>Slippage Preferences</Typography>
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faClose}
                onClick={() => {
                  if (localSlippage === "") {
                    setSlippage("0");
                  }
                  setIsOpen(false);
                }}
              />
            </div>
          </Card.Header>
          <Card.Body>
            <NumberInput
              min={MIN_SLIPPAGE}
              max={MAX_SLIPPAGE}
              endAdornment="%"
              endAdornmentClassName="w-5 h-5 text-mono-500"
              value={localSlippage}
              setValue={handleSlippageChange}
            />
            <div className="h-12">
              {localSlippage ? (
                <Button
                  variant="primary"
                  className="mt-5"
                  onClick={() => {
                    if (localSlippage === "") {
                      setSlippage("0");
                    } else {
                      setSlippage(localSlippage);
                    }
                    setIsOpen(false);
                  }}
                >
                  <Typography variant="h4" color="mono-600">
                    Save
                  </Typography>
                </Button>
              ) : (
                <div className="mt-5 h-12">
                  <Button variant="disabled">Save</Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Dialog>
    </>
  );
};
