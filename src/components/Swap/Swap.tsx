import { MAX_SLIPPAGE, MIN_SLIPPAGE } from "@/config/config";
import { useStakingPoolFromApi } from "@/hooks/staking/useStakingPoolFromApi";
import { PriceData } from "@/hooks/useSolanaPrice";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { SwapInput } from "@/memechan-ui/Atoms/Input";
import FileInput from "@/memechan-ui/Atoms/Input/FileInput";
import NumberInput from "@/memechan-ui/Atoms/Input/NumberInput";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
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
import { TokenInfo } from "memechan-sol-sdk";
import { useTheme } from "next-themes";
import { ChangeEvent, useState } from "react";
import { Oval } from "react-loader-spinner";
import SuccessModal from "../successModal";
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
  quotePrice?: PriceData;
  memePrice?: string;
  quoteTokenInfo?: TokenInfo | null;
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
    quotePrice,
    quoteTokenInfo,
  } = props;
  const [variant, setVariant] = useState<"swap" | "claim">("swap");
  const [localSlippage, setLocalSlippage] = useState(slippage);
  const isVariantSwap = variant === "swap";
  const { connected } = useWallet();
  const [successModalOpened, setSuccessModalOpened] = useState<boolean>(false);
  const { theme } = useTheme();

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
    if (currecyName === "SOL" || currecyName === "SLERF") {
      if (!quotePrice?.price) return undefined;
      return Number(amount) * quotePrice.price;
    }
    if (!memePrice || !amount || amount === "0") return undefined;
    const cleanAmount = amount.replace(/,/g, "");
    const result = new BigNumber(memePrice).multipliedBy(new BigNumber(cleanAmount));
    return result.toNumber();
  };

  return (
    <>
      {successModalOpened && (
        <SuccessModal
          headerText="Successfully purchased WCHAN"
          bodyText="You’re now a WCHAN presale participant! Once it goes live your tokens vesting is started. You’ll be able to claim them hourly within 3 days on “Claim” section or keep them staked to earn trading fees share."
          setSuccessModalOpened={setSuccessModalOpened}
        >
          <Card additionalStyles="mt-3 no-shadow">
            <Card.Header>
              <div>
                <Typography variant="h4" color="mono-600">
                  Post a comment about your purchase
                </Typography>
              </div>
            </Card.Header>
            <Card.Body>
              {/* TODO ALDIN HANDLE POSTING COMMENT */}
              <div className="flex flex-col gap-3">
                <TextInput
                  value={"aaa"}
                  setValue={(e) => console.log(e)}
                  placeholder="Comment"
                  className="primary-border p-[15px] custom-inner-shadow rounded-b-none"
                />
                <div className="flex justify-between items-center gap-3">
                  <FileInput file={{} as File} setFile={(e) => console.log(e)} />
                  <Button
                    className="py-[18px] pr-0 pl-0 max-w-[181px]"
                    variant="primary"
                    // onClick={handleSendReply}
                    // disabled={isLoading}
                  >
                    Post
                    {/* {isLoading ? "Loading..." : "Post"} */}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </SuccessModal>
      )}

      <Card additionalStyles=" bg-mono-200">
        <Card.Header>
          <div className="flex justify-between w-full">
            <div className="flex gap-2 items-center">
              {variant === "swap" ? (
                <>
                  <Typography color={theme === "light" ? "mono-200" : "mono-600"} variant="h4">
                    Swap
                  </Typography>
                  <Typography
                    variant="text-button"
                    color={theme === "light" ? "mono-200" : "mono-500"}
                    underline
                    onClick={() => setVariant("claim")}
                  >
                    Claim
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    color={theme === "light" ? "mono-200" : "mono-500"}
                    onClick={() => setVariant("swap")}
                    variant="text-button"
                    underline
                  >
                    Swap
                  </Typography>
                  <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"}>
                    Claim
                  </Typography>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Typography
                variant="text-button"
                color={theme === "light" ? "mono-200" : "mono-500"}
                underline
                onClick={() => setIsOpen(true)}
              >
                Slippage {slippage}%
              </Typography>
              {!isRefreshing ? (
                <Typography
                  className={`leading-[13px] text-[10px] border-b-[1px] ${
                    theme === "light" ? "border-b-mono-200" : "border-b-mono-500"
                  }`}
                  onClick={() => {
                    refresh();
                  }}
                >
                  🔄
                </Typography>
              ) : (
                <div>
                  <Oval
                    visible={true}
                    height="15px"
                    width="15px"
                    color="#3e3e3e"
                    ariaLabel="oval-loading"
                    secondaryColor="#979797"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )}
              {onClose && (
                <>
                  <Divider vertical className={`ml-1 ${theme === "light" ? "bg-mono-200" : "bg-mono-500"}`} />
                  <Typography onClick={onClose} className="pl-1 mt-[2px]">
                    <FontAwesomeIcon icon={faClose} color="white" fontSize={20} />
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
              quoteTokenInfo={quoteTokenInfo}
              memePrice={memePrice}
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
                  showQuickInput={true}
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
                    <DownArrowIcon fill="#979797" size={12} />
                    <UpArrowIcon fill="#979797" size={12} />
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
                  // usdPrice={quotePrice?.price ? Number(inputAmount ?? 0) * quotePrice.price : 0}
                />
              </div>

              <div className="h-14">
                <WithConnectedWallet
                  variant={
                    !connected
                      ? "primary"
                      : isSwapping
                        ? "disabled"
                        : inputAmount && !isLoadingOutputAmount
                          ? +inputAmount > baseCurrency.coinBalance
                            ? "disabled"
                            : "primary"
                          : "disabled"
                  }
                  className="mt-4"
                  disabled={swapButtonIsDisabled || isLoadingOutputAmount}
                  onClick={onSwap}
                  isLoading={isSwapping || isLoadingOutputAmount}
                >
                  {!inputAmount ? (
                    <div className="h-14 flex items-center">
                      <Button variant="disabled" className="cursor-not-allowed">
                        <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"}>
                          {"Enter an Amount"}
                        </Typography>
                      </Button>
                    </div>
                  ) : (
                    <div className={`h-14 flex items-center`}>
                      {inputAmount && +inputAmount > baseCurrency.coinBalance && !isLoadingOutputAmount ? (
                        <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"}>
                          {"Insufficient balance"}
                        </Typography>
                      ) : (
                        <Typography variant="h4" color={theme === "light" ? "mono-200" : "mono-600"}>
                          {isLoadingOutputAmount ? "Loading..." : isSwapping ? "Swapping..." : "Swap"}
                        </Typography>
                      )}
                    </div>
                  )}
                </WithConnectedWallet>
              </div>
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
        className="fixed inset-0 px-3 sm:px-0 flex items-center justify-center bg-[#19191957] backdrop-blur-[0.5px] z-[100]"
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
