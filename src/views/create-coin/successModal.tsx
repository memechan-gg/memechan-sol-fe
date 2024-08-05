import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import SquareDotsMenu from "@/memechan-ui/icons/SquareDotsMenu";
import { Card } from "@/memechan-ui/Molecules";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import TwitterIcon from "../../memechan-ui/icons/TwitterIcon";

export interface SuccessModalProps {
  headerText: string;
  bodyText: string;
  buttonText?: string;
  onClick: () => void;
}

const SuccessModal = ({ headerText, bodyText, buttonText, onClick }: SuccessModalProps) => {
  return (
    <div className="rounded-tl-[2px] border-[1px] border-solid border-mono-400 m-3 max-w-[406px]">
      <div className="bg-mono-400 px-[10px] h-8 flex justify-between items-center">
        <div className="flex justify-between items-center gap-x-1">
          <SquareDotsMenu size={12} fill="white" />
          <Typography variant="h4" color="green-100">
            {headerText}
          </Typography>
        </div>
        <span className="cursor-pointer flex">
          <FontAwesomeIcon icon={faClose} size="lg" /* onClick={() => setIsSearchActive(false)} */ />
        </span>
      </div>
      <Card.Body additionalStyles="p-[14px]">
        <div>
          <Image src="/Pepe.jpg" alt="Cop pepe" height={400} width={400} />
          <div className="text-left mt-[15px]">
            <Typography variant="body" color="mono-600">
              {bodyText}
            </Typography>
          </div>
          <div className="mt-[15px]">
            <Button variant="primary" onClick={onClick} className="flex items-center justify-center h-14">
              <TwitterIcon size={16} />
              <span className="ml-2 flex items-center">
                <Typography variant="h4">{buttonText}</Typography>
              </span>
            </Button>
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <Typography variant="body" color="mono-500" underline>
          close
        </Typography>
      </Card.Footer>
    </div>
  );
};

export default SuccessModal;
