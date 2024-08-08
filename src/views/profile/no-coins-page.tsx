import { Typography } from "@/memechan-ui/Atoms/Typography";
import SquareDotsMenu from "@/memechan-ui/icons/SquareDotsMenu";
import { useTheme } from "next-themes";
import Link from "next/link";

export const NoCoinsPage = ({ isMyPage }: { isMyPage: boolean }) => {
  const { theme } = useTheme();
  return (
    <div className="w-full mx-3 rounded-tl-sm rounded-tr-sm border border-solid border-mono-400">
      <div className="bg-mono-400 h-8 p-4 flex justify-between items-center">
        <div className="flex justify-between items-center gap-x-1">
          <SquareDotsMenu size={12} fill="white" />
          <Typography variant="h4" color="green-100">
            Memchan dev
          </Typography>
        </div>
        <Typography variant="body" color={theme === "light" ? "mono-200" : "mono-500"}>
          Now
        </Typography>
      </div>
      <div className="p-4 sm:flex">
        <div className="w-full max-w-sm">
          <img src="/no-coins.jpg" alt="No coins" />
        </div>
        <div className="text-left mt-4 sm:mt-0 sm:ml-4">
          <Typography variant="body" color="mono-600">
            What are you even doing here?
          </Typography>
          <div className="mb-4">
            <Typography variant="h4">
              {isMyPage
                ? "You haven't bought ANYTHING yet, you retard."
                : "This user hasn't bought anything yet, you retard."}
            </Typography>
          </div>
          <Typography variant="body" color="mono-600">
            {isMyPage
              ? "But when you are you'll be able to manage your holdings here!"
              : "But when they do you'll be able to see it here!"}
          </Typography>
        </div>
      </div>
      <div className="bg-mono-400 hidden h-8 px-4 sm:flex justify-between items-center">
        <Link href="/">
          <Typography underline variant="text-button" color={theme === "light" ? "mono-200" : "mono-500"}>
            {" >>Buy Now"}
          </Typography>
        </Link>
      </div>
    </div>
  );
};
