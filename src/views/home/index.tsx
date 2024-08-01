import InitialDisclaimer from "@/components/intial-disclaimer";
import { TokenCard } from "@/components/TokenCard";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { formatNumberForTokenCard } from "@/utils/formatNumbersForTokenCard";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
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

  const isLoading = tokenList === null;
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
      <div className="self-start ml-[-16px]">
        <Tabs tabs={tabs} onTabChange={onTabChange} activeTab={activeTab} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-center w-full">
        {isLoading && <Typography variant="h4">Loading...</Typography>}
        {isCoinsListExist &&
          tokenList.map((token, index) => (
            <TokenCard
              key={`${index}-${token.address}`}
              progressInfo={formatNumberForTokenCard({ token })}
              token={token}
              showCheckmark
              showOnClick
            />
          ))}
        {isCoinsListEmpty && <Typography>No memecoins yet</Typography>}
      </div>
    </div>
  );
}

// export function Homee() {
//   const {
//     items: tokenList,
//     status,
//     setStatus,
//     sortBy,
//     setSortBy,
//     direction,
//     setDirection,
//     liveNextPageToken,
//     presaleNextPageToken,
//     loadMore,
//   } = useCoinApi();

//   const isLoading = tokenList === null;
//   const isCoinsListExist = tokenList !== null && tokenList.length > 0;
//   const isCoinsListEmpty = tokenList !== null && tokenList.length === 0;
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
//   const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
//   const [isMounted, setIsMounted] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     setIsMounted(true);
//     const confirmed = Cookies.get("isConfirmed");
//     if (confirmed === "true") {
//       setIsConfirmed(true);
//       setIsDialogOpen(false);
//     }
//   }, []);

//   const onCreateMemecoinClick = () => {
//     track("CreateMemecoin", { placement: "NoticeBoardMainPage" });
//   };

//   const handleConfirm = () => {
//     setIsConfirmed(true);
//     setIsDialogOpen(false);
//     Cookies.set("isConfirmed", "true", { expires: 365 });
//   };

//   if (!isMounted) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       {!isConfirmed && (
//         <Dialog open={isDialogOpen} onOpenChange={() => {}}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle className="text-xl text-regular text-center mb-5">Disclaimer</DialogTitle>
//             </DialogHeader>
//             <div className="text-regular text-justify mb-1">
//               I confirm that I am a citizen of Afghanistan, Benin, China, Crimea region, Cuba, Iran, Iraq, Syria, USA,
//               Vatican City, or for use by any person in any country or jurisdiction where such distribution or use would
//               be contrary to local law or regulation.
//             </div>
//             <DialogFooter>
//               <button
//                 className="flex border border-regular text-regular hover:bg-regular hover:text-white font-bold py-2 px-4 rounded"
//                 onClick={handleConfirm}
//               >
//                 Confirm
//               </button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//       {isConfirmed && (
//         <>
//           <NoticeBoard title="create memecoin">
//             <div className="flex flex-col gap-2">
//               <div className="lowercase">
//                 Create your own memecoin with a few clicks. No coding or liquidity required.
//               </div>
//               <div>
//                 <Link href={"/create"} onClick={onCreateMemecoinClick}>
//                   <button className="bg-regular text-white font-bold p-2 rounded-lg lowercase">create memecoin</button>
//                 </Link>
//               </div>
//             </div>
//           </NoticeBoard>
//           <ThreadBoard
//             title="memecoins"
//             titleChildren={
//               <div className="flex flex-row gap-1 text-xs">
//                 {status !== null ? (
//                   <Dropdown
//                     items={["all", "pre_sale", "live"]}
//                     activeItem={status}
//                     title="status"
//                     onItemChange={(item) => {
//                       if (isThreadsSortStatus(item)) {
//                         track("List_SetStatus", { status: item });
//                         setStatus(item);
//                       }
//                     }}
//                   />
//                 ) : (
//                   <Skeleton width={40} />
//                 )}

//                 {sortBy !== null ? (
//                   <Dropdown
// sortBy()  items={["last_reply", "creation_time", "market_cap"]}
//                     items={["last_reply", "creation_time", "market_cap"]}
//                     activeItem={sortBy}
//                     title="sort by"
//                     onItemChange={(item) => {
//                       if (isThreadsSortBy(item)) {
//                         track("List_SetSortBy", { sortBy: item });
//                         setSortBy(item);
//                       }
//                     }}
//                   />
//                 ) : (
//                   <Skeleton width={40} />
//                 )}

//                 {direction !== null ? (
//                   <Dropdown
//                     items={["asc", "desc"]}
//                     activeItem={direction}
//                     title="order"
//                     onItemChange={(item) => {
//                       if (isThreadsSortDirection(item)) {
//                         track("List_SortDirection", { sortDirection: item });
//                         setDirection(item);
//                       }
//                     }}
//                   />
//                 ) : (
//                   <Skeleton width={40} />
//                 )}
//               </div>
//             }
//           >
//             <div className="flex flex-col items-center">
//               <div className="flex flex-wrap gap-6 sm:justify-normal justify-center self-start">
//                 {isLoading && (
//                   <>
//                     <div className="text-regular">Loading...</div>
//                   </>
//                 )}
//                 {isCoinsListExist && (
//                   <>
//                     {tokenList.map((item) => (
//                       <Thread key={item.address} coinMetadata={item} />
//                     ))}
//                   </>
//                 )}
//                 {isCoinsListEmpty && (
//                   <>
//                     <div className="text-regular">No memecoins yet</div>
//                   </>
//                 )}
//               </div>
//               {((status === "live" && liveNextPageToken) ||
//                 (status === "pre_sale" && presaleNextPageToken) ||
//                 (status === "all" && (presaleNextPageToken || liveNextPageToken))) && (
//                 <div
//                   onClick={loadMore}
//                   className="text-regular font-xs flex justify-self-center mt-7 cursor-pointer hover:underline"
//                 >
//                   Load more
//                 </div>
//               )}
//             </div>
//           </ThreadBoard>
//         </>
//       )}
//     </>
//   );
// }
