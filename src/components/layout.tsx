import { Footer } from "./footer";
import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full px-3 xl:px-0 max-w-[1240px] m-auto">
      <Header />
      <main className="flex flex-grow flex-col items-center lg:mt-0">
        <div className="mt-[65px] lg:px-0 w-full">
          <div className="flex flex-col items-center gap-2">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
