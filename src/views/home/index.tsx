import InitialDisclaimer from "@/components/intial-disclaimer";
import { TokenCard } from "@/components/TokenCard";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { formatNumberForTokenCard } from "@/utils/formatNumbersForTokenCard";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useCoinApi } from "./hooks/useCoinApi";

const tabs = ["New", "Rising", "Live"];

export function Home() {
  const {
    items: tokenList,
    status,
    setStatus,
    sortBy,
    setSortBy,
    direction,
    setDirection,
    liveNextPageToken,
    presaleNextPageToken,
    loadMore,
  } = useCoinApi();

  const observer = useRef<IntersectionObserver | null>(null);

  const isLoading = tokenList === null;
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, loadMore],
  );
  useEffect(() => {
    setStatus("pre_sale");
    setSortBy("creation_time");
  }, [setSortBy, setStatus]);

  const isCoinsListExist = tokenList !== null && tokenList.length > 0;
  const isCoinsListEmpty = tokenList !== null && tokenList.length === 0;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const confirmed = Cookies.get("isConfirmed");
    if (confirmed === "true") {
      setIsConfirmed(true);
      setIsDialogOpen(false);
    }
  }, []);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setIsDialogOpen(false);
    Cookies.set("isConfirmed", "true", { expires: 365 });
  };

  const [activeTab, setActiveTab] = useState(tabs[0]);

  if (!isMounted) {
    return <Typography>Loading...</Typography>;
  }

  if (!isConfirmed) {
    return (
      <Dialog
        isOpen={isDialogOpen}
        onDismiss={() => setIsDialogOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-mono-200 md:bg-[#19191957] md:backdrop-blur-[0.5px] md:z-50"
      >
        <div className="max-w-sm max-h-full mx-2 overflow-auto bg-mono-200 shadow-ligsht">
          <InitialDisclaimer onConfirm={handleConfirm} />
        </div>
      </Dialog>
    );
  }

  const showNew = () => {
    setStatus("pre_sale");
    setSortBy("creation_time");
  };

  const showRising = () => {
    setStatus("pre_sale");
    setSortBy("market_cap");
  };

  const showLive = () => {
    setStatus("live");
    setSortBy("creation_time");
  };

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
    track("List_SetStatus", { status: tab });
    track("List_SetSortBy", { sortBy: tab });
    switch (tab) {
      case "New": {
        showNew();
        break;
      }
      case "Rising": {
        showRising();
        break;
      }
      case "Live": {
        showLive();
        break;
      }

      default:
        throw new Error("Invalid tab");
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-w-80 px-3 pt-3 xl:px-0">
      <div className="self-start w-full">
        <Tabs
          className="justify-start items-center gap-x-5 ml-[-5px]"
          tabs={tabs}
          onTabChange={onTabChange}
          activeTab={activeTab}
        />
      </div>
      {isLoading && (
        <div className="flex justify-center items-center w-full h-full">
          <Oval
            visible={true}
            height="75px"
            width="75px"
            color="#3e3e3e"
            ariaLabel="oval-loading"
            secondaryColor="#979797"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      {isCoinsListExist && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-center w-full">
          {tokenList.map((token, index) => (
            <TokenCard
              key={`${token.address}`}
              progressInfo={formatNumberForTokenCard({ token })}
              token={token}
              showCheckmark
              showOnClick
            />
          ))}
          {isCoinsListEmpty && <Typography>No memecoins yet</Typography>}
        </div>
      )}
      <div ref={sentinelRef} className="w-full h-10" />
    </div>
  );
}
