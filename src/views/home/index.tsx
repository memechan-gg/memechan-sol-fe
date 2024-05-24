import { Dropdown } from "@/components/dropdown";
import { NoticeBoard, Thread, ThreadBoard } from "@/components/thread";
import Link from "next/link";
import { useCoinApi } from "./hooks/useCoinApi";

export function Home() {
  const { items, status, setStatus, sortBy, setSortBy, direction, setDirection } = useCoinApi();

  return (
    <>
      <NoticeBoard title="Create Meme Coin">
        <div className="flex flex-col gap-2">
          <div>Create your own meme coin with a few clicks. No coding or liquidity required.</div>
          <div>
            <Link href={"/create"}>
              <button className="bg-regular text-white font-bold p-2 rounded-lg">Create Meme Coin</button>
            </Link>
          </div>
        </div>
      </NoticeBoard>
      <ThreadBoard
        title="Meme Coins"
        titleChildren={
          <div className="flex flex-row gap-1 text-xs">
            <Dropdown
              items={["all", "pre_sale", "live"]}
              activeItem={status}
              title="status"
              onItemChange={(item) => {
                setStatus(item as "all" | "pre_sale" | "live");
              }}
            />
            <Dropdown
              items={["last_reply", "creation_time", "market_cap"]}
              activeItem={sortBy}
              title="sort by"
              onItemChange={(item) => {
                setSortBy(item);
              }}
            />
            <Dropdown
              items={["asc", "desc"]}
              activeItem={direction}
              title="order"
              onItemChange={(item) => {
                setDirection(item as "asc" | "desc");
              }}
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-6 sm:justify-normal justify-center">
          {items.map((item) => (
            <Thread
              mint={item.address}
              key={item.address}
              title={item.name}
              image={item.image}
              createdBy={item.creator}
              marketCap={item.marketcap.toString()}
              ticker={item.symbol}
              description={item.description}
            />
          ))}
        </div>
      </ThreadBoard>
    </>
  );
}
