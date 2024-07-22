import InitialDisclaimer from "@/components/intial-disclaimer";
import { TokenCard } from "@/components/TokenCard";
import { Dialog } from "@reach/dialog";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useCoinApi } from "./hooks/useCoinApi";

export function Home() {
  const { items: tokenList, status, liveNextPageToken, loadMore } = useCoinApi();

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
        <Dialog
          isOpen={isDialogOpen}
          onDismiss={() => setIsDialogOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-mono-200 md:bg-[#19191957] md:backdrop-blur-[0.5px] md:z-50"
        >
          <div className="max-w-sm max-h-full mx-2 overflow-auto bg-mono-200 shadow-ligsht">
            <InitialDisclaimer onConfirm={handleConfirm} />
          </div>
        </Dialog>
      )}
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
          {isLoading && <div className="text-regular">Loading...</div>}
          {isCoinsListExist && tokenList.map((token) => <TokenCard key={token.address} token={token} />)}
          {isCoinsListEmpty && <div className="text-regular">No memecoins yet</div>}
        </div>
      </div>
    </>
  );
}
