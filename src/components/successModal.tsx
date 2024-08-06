import { Typography } from "@/memechan-ui/Atoms/Typography";
import SquareDotsMenu from "@/memechan-ui/icons/SquareDotsMenu";
import { Card } from "@/memechan-ui/Molecules";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export interface SuccessModalProps {
  headerText: string;
  bodyText: string;
  buttonText?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  setSuccessModalOpened: Dispatch<SetStateAction<boolean>>;
}

const SuccessModal = ({ headerText, bodyText, children, setSuccessModalOpened, onClick }: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40  backdrop-blur-[0.5px]">
      <div className="rounded-tl-[2px] m-3 border-[1px] border-solid border-mono-400 bg-white max-w-[406px] w-full">
        <div className="bg-mono-400 px-[10px] h-8 flex justify-between items-center">
          <div className="flex justify-between items-center gap-x-1">
            <SquareDotsMenu size={12} fill="white" />
            <Typography variant="h4" color="green-100">
              {headerText}
            </Typography>
          </div>
          <span className="cursor-pointer flex" onClick={() => setSuccessModalOpened(false)}>
            <FontAwesomeIcon icon={faClose} size="lg" />
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
            {children}
          </div>
        </Card.Body>
        <Card.Footer>
          <Typography variant="body" color="mono-500" underline onClick={() => setSuccessModalOpened(false)}>
            Close
          </Typography>
        </Card.Footer>
      </div>
    </div>
  );
};

export default SuccessModal;
