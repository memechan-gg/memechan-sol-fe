import Link from "next/link";

export const Footer = () => (
  <footer className="pb-2 pt-6 flex flex-col items-center justify-center text-regular text-xs">
    <div className="flex gap-0 mb-2">
      <Link
        href="https://x.com/memechan_gg"
        className="hidden md:block bg-title bg-opacity-15 text-xs font-normal text-regular px-2  border border-regular transition-all duration-300 hover:bg-opacity-25"
      >
        Twitter
      </Link>
      <Link
        href="https://t.me/memechan_gg"
        className="hidden md:block bg-title bg-opacity-15 text-xs font-normal text-regular px-2  border border-regular transition-all duration-300 hover:bg-opacity-25"
      >
        Telegram
      </Link>
    </div>
    powered by memechan community
  </footer>
);
