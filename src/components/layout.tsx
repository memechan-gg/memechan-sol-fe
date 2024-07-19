import { Footer } from "./footer";
import { Header } from "./header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex flex-grow flex-col items-center lg:mt-0">
        <div className=" sm:conteiner mx-auto px-2 sm:px-6 lg:px-8">
          <div className="mt-12 w-full flex flex-col items-center">
            <div className="w-full flex flex-col gap-2">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
