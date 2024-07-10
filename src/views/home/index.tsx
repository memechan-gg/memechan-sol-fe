import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog";
import { Dropdown } from "@/components/dropdown";
import { NoticeBoard, Thread, ThreadBoard } from "@/components/thread";
import { track } from "@vercel/analytics";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useResizeDetector } from "react-resize-detector";
import { FixedSizeGrid as Grid } from "react-window";
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
  const [clickedToken, setClickedToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const confirmed = Cookies.get("isConfirmed");
    if (confirmed === "true") {
      setIsConfirmed(true);
      setIsDialogOpen(false);
    }
  }, []);

  const onCreateMemecoinClick = () => {
    track("CreateMemecoin", { placement: "NoticeBoardMainPage" });
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    setIsDialogOpen(false);
    Cookies.set("isConfirmed", "true", { expires: 365 });
  };

  const { width, height, ref } = useResizeDetector();

  const itemSize = 258;
  const columnCount = width ? Math.max(1, Math.floor(width / (itemSize - 90))) : 1;
  const rowCount = Math.ceil((tokenList?.length ?? 0) / columnCount);

  const handleTokenClick = (event: React.MouseEvent<HTMLDivElement>, address: string) => {
    if (event.target === event.currentTarget) {
      setClickedToken(address);
      router.push(`/coin/${address}`);
    }
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
          <NoticeBoard title="create memecoin">
            <div className="flex flex-col gap-2">
              <div className="lowercase">
                Create your own memecoin with a few clicks. No coding or liquidity required.
              </div>
              <div>
                <Link href={"/create"} onClick={onCreateMemecoinClick}>
                  <button className="bg-regular text-white font-bold p-2 rounded-lg lowercase">create memecoin</button>
                </Link>
              </div>
            </div>
          </NoticeBoard>
          <ThreadBoard
            title="memecoins"
            titleChildren={
              <div className="flex flex-row gap-1 text-xs">
                {status !== null ? (
                  <Dropdown
                    items={["all", "pre_sale", "live"]}
                    activeItem={status}
                    title="status"
                    onItemChange={(item) => {
                      if (isThreadsSortStatus(item)) {
                        track("List_SetStatus", { status: item });
                        setStatus(item);
                      }
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
                      if (isThreadsSortBy(item)) {
                        track("List_SetSortBy", { sortBy: item });
                        setSortBy(item);
                      }
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
                      if (isThreadsSortDirection(item)) {
                        track("List_SortDirection", { sortDirection: item });
                        setDirection(item);
                      }
                    }}
                  />
                ) : (
                  <Skeleton width={40} />
                )}
              </div>
            }
          >
            <div className="flex flex-col items-center">
              <div
                ref={ref}
                className="h-[50vh] md:h-[70vh] w-full flex flex-wrap gap-6 sm:justify-normal justify-center self-start"
              >
                {isLoading && (
                  <>
                    <div className="text-regular">Loading...</div>
                  </>
                )}
                {isCoinsListExist && width && height && (
                  <Grid
                    columnCount={columnCount}
                    columnWidth={itemSize - 90}
                    rowCount={rowCount}
                    rowHeight={itemSize + 20}
                    width={width}
                    height={height}
                    itemData={tokenList}
                    className="outline-none !w-auto md:!w-full"
                  >
                    {({ columnIndex, rowIndex, style, data }) => {
                      const index = rowIndex * columnCount + columnIndex;
                      const item = data[index];
                      if (!item) return <div style={style} />;

                      return (
                        <div
                          style={{ ...style }}
                          className={`p-2 flex flex-col gap-2 ${clickedToken === item.address ? "border-2 shadow-[0px_0px_60px_2px]" : "border-transparent"} hover:border-blue-500 hover:shadow-lg cursor-pointer`}
                          onClick={(event) => handleTokenClick(event, item.address)}
                        >
                          <Thread key={item.address} coinMetadata={item} setClickedToken={setClickedToken} />
                        </div>
                      );
                    }}
                  </Grid>
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
