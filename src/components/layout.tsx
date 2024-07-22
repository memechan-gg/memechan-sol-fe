import { Footer } from "./footer";
import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex flex-grow flex-col items-center lg:mt-0 lg:mx-[150px]">
        <div className="mt-[100px] px-3 lg:px-0 w-full">
          <div className="flex flex-col items-center gap-2">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
