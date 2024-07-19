import InitialDisclaimer from "@/components/intial-disclaimer";
import { TokenCard } from "@/components/token-card";
import Button from "@/memechan-ui/Atoms/Button";
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
        // <Dialog open={isDialogOpen} onOpenChange={() => {}}>
        //   <DialogContent>
        //     <DialogHeader>
        //       <DialogTitle className="text-xl text-center mb-5">Disclaimer</DialogTitle>
        //     </DialogHeader>
        //     <div className="text-justify mb-1">
        //       I confirm that I am a citizen of Afghanistan, Benin, China, Crimea region, Cuba, Iran, Iraq, Syria, USA,
        //       Vatican City, or for use by any person in any country or jurisdiction where such distribution or use would
        //       be contrary to local law or regulation.
        //     </div>
        //     <DialogFooter>
        //       <button
        //         className="flex border text-regular hover:bg-regular hover:text-white font-bold py-2 px-4 rounded"
        //         onClick={handleConfirm}
        //       >
        //         Confirm
        //       </button>
        //     </DialogFooter>
        //   </DialogContent>
        // </Dialog>
        <InitialDisclaimer
          headerText={"Disclaimer"}
          bodyText="I confirm that I am a citizen of Afghanistan, Benin, China, Crimea region, Cuba, Iran, Iraq, Syria, USA,
        //       Vatican City, or for use by any person in any country or jurisdiction where such distribution or use would
        //       be contrary to local law or regulation."
          onClick={() => {}}
        />
      )}
      {isConfirmed && (
        <div className="flex flex-col items-center">
          <Button type="primary">Confirm</Button>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
            {isLoading && <div className="text-regular">Loading...</div>}
            {isCoinsListExist && tokenList.map((token) => <TokenCard key={token.address} token={token} />)}
            {isCoinsListEmpty && <div className="text-regular">No memecoins yet</div>}
          </div>
        </div>
      )}
    </>
  );
}
