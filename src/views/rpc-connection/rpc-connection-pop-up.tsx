// import Button from "@/components/button";
import { RadioButton } from "@/components/radio-button";
import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import UncontrolledTextInput from "@/memechan-ui/Atoms/Input/UncontrolledTextInput";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@reach/dialog";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CONNECTION_OPTIONS = [
  { id: "memechan", label: "Memechan RPC Pool" },
  { id: "custom", label: "Custom" },
];

export const RpcConnectionPopUp = () => {
  const { setRpcEndpoint } = useConnection();
  const [selectedRpcConnection, setSelectedRpcConnection] = useState<string>("memechan");
  const [customRpcUrl, setCustomRpcUrl] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
  useEffect(() => {
    const savedRpcEndpoint = typeof window !== "undefined" && localStorage.getItem("rpc-endpoint");
    if (savedRpcEndpoint && savedRpcEndpoint !== MEMECHAN_RPC_ENDPOINT) {
      setSelectedRpcConnection("custom");
      setCustomRpcUrl(savedRpcEndpoint);
    }
  }, []);

  const handleSave = () => {
    if (selectedRpcConnection === "custom") {
      // Custom RPC URL validation
      if (!customRpcUrl.startsWith("https://")) {
        toast.error("Custom RPC URL must start with 'https://'");
        return;
      }

      try {
        new URL(customRpcUrl);
      } catch (e) {
        toast.error("Invalid URL format");
        return;
      }

      track("SetRPC", { rpc: customRpcUrl });

      setRpcEndpoint(customRpcUrl);
      toast.success(`Your RPC is currently set to ${customRpcUrl}`);
    } else {
      track("SetRPC", { rpc: MEMECHAN_RPC_ENDPOINT });
      setRpcEndpoint(MEMECHAN_RPC_ENDPOINT);
      setCustomRpcUrl("");
      toast.success("Your RPC is currently set to Memechan RPC Pool");
    }
  };

  return (
    <Dialog
      isOpen={isDialogOpen}
      onDismiss={() => setIsDialogOpen(false)}
      className="  fixed inset-0 flex items-center justify-center   bg-[#19191957]  backdrop-blur-[0.5px]  z-50"
    >
      <div className=" mx-3 sm:mx-auto w-full max-w-[406px] h-fit border border-mono-400 custom-outer-shadow bg-mono-200 flex flex-col">
        <div className=" px-4 h-8 flex items-center justify-between bg-mono-400">
          <Typography variant="h4">RPC Connection</Typography>
          <span className="cursor-pointer flex">
            <FontAwesomeIcon icon={faClose} size="lg" onClick={() => setIsDialogOpen(false)} />
          </span>
        </div>
        <div className="mt-6 mx-4 flex flex-col gap-2.5">
          {CONNECTION_OPTIONS.map((option, index) => (
            <>
              <Typography variant="body" color="mono-600">
                <div>
                  <RadioButton
                    key={option.id}
                    id={option.id}
                    name="rpc-connection"
                    label={option.label}
                    selectedValue={selectedRpcConnection}
                    onChange={setSelectedRpcConnection}
                  />
                  {index < CONNECTION_OPTIONS.length - 1 && <Divider className="mt-5" />}
                </div>
              </Typography>
            </>
          ))}
          <div className=" mt-2">
            <UncontrolledTextInput
              type="url"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              placeholder="https://my-rpc.com"
            />
          </div>
          <div className="mt-2 mb-4 h-12">
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
