import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog";
import { Dropdown } from "@/components/dropdown";
import { NoticeBoard, Thread, ThreadBoard } from "@/components/thread";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useCoinApi } from "./hooks/useCoinApi";
import { isThreadsSortBy, isThreadsSortDirection, isThreadsSortStatus } from "./hooks/utils";

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

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!isConfirmed && (
        <Dialog open={isDialogOpen} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl text-regular text-center mb-5">Disclaimer</DialogTitle>
            </DialogHeader>
            <div className="text-regular text-justify mb-1">
              I confirm that I am a citizen of Afghanistan, Benin, China, Crimea region, Cuba, Iran, Iraq, Syria, USA,
              Vatican City, or for use by any person in any country or jurisdiction where such distribution or use would
              be contrary to local law or regulation.
            </div>
            <DialogFooter>
              <button
                className="flex border border-regular text-regular hover:bg-regular hover:text-white font-bold py-2 px-4 rounded"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {isConfirmed && (
        <>
          <NoticeBoard title="Create Meme Coin">
            <div className="flex flex-col gap-2">
              <div>Create your own meme coin with a few clicks. No coding or liquidity required.</div>
              <div>
                <Link href={"/create"}>
                  <button className="bg-regular text-white font-bold p-2 rounded-lg">Create Memecoin</button>
                </Link>
              </div>
            </div>
          </NoticeBoard>
          <ThreadBoard
            title="Meme Coins"
            titleChildren={
              <div className="flex flex-row gap-1 text-xs">
                {status !== null ? (
                  <Dropdown
                    items={["all", "pre_sale", "live"]}
                    activeItem={status}
                    title="status"
                    onItemChange={(item) => {
                      if (isThreadsSortStatus(item)) setStatus(item);
                    }}
                  />
                ) : (
                  <Skeleton width={40} />
                )}

                {sortBy !== null ? (
                  <Dropdown
                    items={["last_reply", "creation_time", "market_cap"]}
                    activeItem={sortBy}
                    title="sort by"
                    onItemChange={(item) => {
                      if (isThreadsSortBy(item)) setSortBy(item);
                    }}
                  />
                ) : (
                  <Skeleton width={40} />
                )}

                {direction !== null ? (
                  <Dropdown
                    items={["asc", "desc"]}
                    activeItem={direction}
                    title="order"
                    onItemChange={(item) => {
                      if (isThreadsSortDirection(item)) setDirection(item);
                    }}
                  />
                ) : (
                  <Skeleton width={40} />
                )}
              </div>
            }
          >
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap gap-6 sm:justify-normal justify-center self-start">
                {isLoading && (
                  <>
                    <div className="text-regular">Loading...</div>
                  </>
                )}
                {isCoinsListExist && (
                  <>
                    {tokenList.map((item) => (
                      <Thread key={item.address} coinMetadata={item} />
                    ))}
                  </>
                )}
                {isCoinsListEmpty && (
                  <>
                    <div className="text-regular">No memecoins yet</div>
                  </>
                )}
              </div>
              {((status === "live" && liveNextPageToken) ||
                (status === "pre_sale" && presaleNextPageToken) ||
                (status === "all" && (presaleNextPageToken || liveNextPageToken))) && (
                <div
                  onClick={loadMore}
                  className="text-regular font-xs flex justify-self-center mt-7 cursor-pointer hover:underline"
                >
                  Load more
                </div>
              )}
            </div>
          </ThreadBoard>
        </>
      )}
    </>
  );
}
