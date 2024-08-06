import { usePopup } from "@/context/PopupContext";
import { useUser } from "@/context/UserContext";
import type { ButtonProps } from "@/memechan-ui/Atoms";
import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";

export const WithConnectedWallet = (props: ButtonProps) => {
  const { isPopupOpen, openPopup, closePopup, setIsPopupOpen } = usePopup();
  const account = useUser();

  if (!account.address) {
    return (
      <Button
        {...props}
        role="button"
        onClick={(e) => {
          e.preventDefault();
          setIsPopupOpen(!isPopupOpen);
        }}
      >
        <Typography variant="h4">Connect Wallet</Typography>
      </Button>
    );
  }

  return <Button {...props} />;
};
