import { Button } from "@/components/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/dialog";
import { RadioButton } from "@/components/radio-button";
import { MEMECHAN_RPC_ENDPOINT } from "@/config/config";
import { useConnection } from "@/context/ConnectionContext";
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-regular mb-4">RPC Connection</DialogTitle>
        <div className="text-regular flex flex-col gap-2.5">
          {CONNECTION_OPTIONS.map((option) => (
            <RadioButton
              key={option.id}
              id={option.id}
              name="rpc-connection"
              label={option.label}
              selectedValue={selectedRpcConnection}
              onChange={setSelectedRpcConnection}
            />
          ))}
          {selectedRpcConnection === "custom" && (
            <input
              className="border w-[200px] border-regular rounded-lg p-1 mt-1 text-sm focus:border-regular focus:outline-none"
              type="url"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              placeholder="https://my-rpc.com"
            />
          )}
          <Button
            className="w-20 bg-regular bg-opacity-80 hover:bg-opacity-50 text-xs font-bold text-white mt-2.5"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogHeader>
    </DialogContent>
  );
};
