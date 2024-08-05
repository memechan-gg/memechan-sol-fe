import { usePopup } from "@/context/PopupContext";
import { useUser } from "@/context/UserContext";
import type { ButtonProps } from "@/memechan-ui/Atoms";
import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";

export const WithConnectedWallet = (props: ButtonProps) => {
  const { isPopupOpen, openPopup, closePopup, setIsPopupOpen } = usePopup();
  const account = useUser();

  console.log(account);
  if (!account.address) {
    console.log("here");
    return (
      <Button {...props} role="button" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        <Typography variant="h4">Connect Wallet</Typography>
      </Button>
    );
  }
  console.log("mnt here");

  return <Button {...props} />;
};
