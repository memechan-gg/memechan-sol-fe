import { searchAtom } from "@/atoms";
import { useRecoilValue } from "recoil";
import { Footer } from "./footer";
import { Header } from "./header";
import { SearchModal } from "./SearchModal/SearchModal";

export function Layout({ children }: { children: React.ReactNode }) {
  const searchValue = useRecoilValue(searchAtom);

  const isSearchActive = searchValue.length !== 0;

  return (
    <div className="flex flex-col min-h-screen w-full xl:px-0 max-w-[1240px] m-auto">
      <Header />
      <main className="flex flex-grow flex-col items-center lg:mt-0">
        <div className="mt-[65px] lg:px-0 w-full">
          <div className="flex flex-col items-center gap-2">{isSearchActive ? <SearchModal /> : children}</div>
        </div>
      </main>
      <div className=" hidden sm:block py-3 bottom-border w-screen -ml-3 xl:-ml-sideMargin" />
      <Footer />
    </div>
  );
}
