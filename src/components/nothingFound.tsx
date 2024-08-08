import { Typography } from "@/memechan-ui/Atoms/Typography";
import SquareDotsMenu from "@/memechan-ui/icons/SquareDotsMenu";
import { Card } from "@/memechan-ui/Molecules";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction } from "react";

export interface NothingFoundProps {
  headerText: string;
  bodyText: string;
  buttonText?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  setNothingFoundModalOpened?: Dispatch<SetStateAction<boolean>>;
}

const NothingFound = ({ headerText, bodyText, children, setNothingFoundModalOpened, onClick }: NothingFoundProps) => {
  const { theme } = useTheme();

  return (
    <div className=" w-full flex items-center justify-center ">
      <div className="rounded-tl-[2px] border-[1px] border-solid border-mono-400 bg-white w-full">
        <div className="bg-mono-400 px-[10px] h-8 flex justify-between items-center">
          <div className="flex justify-between items-center gap-x-1">
            <SquareDotsMenu size={12} fill="white" />
            <Typography variant="h4" color="green-100">
              {headerText}
            </Typography>
          </div>
          <Typography color={theme === "light" ? "mono-200" : "mono-500"}>Sup</Typography>
        </div>
        <Card.Body additionalStyles="p-[14px]">
          <div className="sm:flex ">
            <div>
              <img className="w-full sm:w-[180px] sm:h-[202px]" src="/nothingFound.png" alt="Nothing found" />
            </div>
            <div className="text-left mt-[15px] sm:flex sm:flex-col sm:mt-0">
              <Typography variant="body" color="mono-600" className="sm:ml-3 sm:flex-col">
                {bodyText}
              </Typography>
              {children}
            </div>
          </div>
        </Card.Body>
        {/* <Card.Footer>
          <Typography variant="body" color="mono-500" underline onClick={() => setNothingFoundModalOpened(false)}>
            Close
          </Typography>
        </Card.Footer> */}
      </div>
    </div>
  );
};

export default NothingFound;
